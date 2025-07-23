const axios = require('axios');

// Альтернативный способ работы с VK без user token
// Используем service token для получения максимума данных

const SERVICE_TOKEN = '354ed2d4354ed2d4354ed2d47f3679d23c3354e354ed2d45d356c7132c1c3792a601dda';
const GROUP_ID = 229245500;

async function getVKDataAlternative() {
  console.log('🔧 Альтернативный подход: используем service token максимально эффективно...\n');
  
  try {
    // 1. Получаем записи со стены с видео
    console.log('📰 Получаем записи со стены...');
    const wallResponse = await axios.get('https://api.vk.com/method/wall.get', {
      params: {
        owner_id: -GROUP_ID,
        access_token: SERVICE_TOKEN,
        v: '5.131',
        count: 100,
        filter: 'all'
      }
    });

    if (wallResponse.data.error) {
      console.error('❌ Ошибка wall.get:', wallResponse.data.error);
      return;
    }

    // 2. Извлекаем видео из постов
    const posts = wallResponse.data.response.items;
    const videos = [];
    
    posts.forEach(post => {
      if (post.attachments) {
        post.attachments.forEach(attachment => {
          if (attachment.type === 'video' && attachment.video) {
            const video = attachment.video;
            videos.push({
              id: `${video.owner_id}_${video.id}`,
              title: video.title || 'Без названия',
              duration: formatDuration(video.duration),
              thumbnailUrl: getBestThumbnail(video),
              videoUrl: `https://vk.com/video${video.owner_id}_${video.id}`,
              embedUrl: `https://vk.com/video_ext.php?oid=${video.owner_id}&id=${video.id}&hd=2&autoplay=0`,
              views: video.views || 0,
              uploadDate: new Date(video.date * 1000).toISOString(),
              postText: post.text || '',
              postDate: new Date(post.date * 1000).toISOString()
            });
          }
        });
      }
    });

    console.log(`✅ Найдено ${videos.length} видео`);

    // 3. Создаем структуру плейлистов на основе найденных видео
    const playlists = createPlaylistsFromVideos(videos);
    
    // 4. Сохраняем результат
    const result = {
      timestamp: new Date().toISOString(),
      totalVideos: videos.length,
      playlists: playlists,
      allVideos: videos
    };

    require('fs').writeFileSync('vk-alternative-result.json', JSON.stringify(result, null, 2));
    console.log('💾 Результат сохранен в vk-alternative-result.json');

    return result;

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function getBestThumbnail(video) {
  // Выбираем лучшее качество thumbnail
  if (video.image && video.image.length > 0) {
    const sorted = video.image.sort((a, b) => (b.width || 0) - (a.width || 0));
    return sorted[0].url;
  }
  return 'https://vk.com/images/camera_50.png';
}

function createPlaylistsFromVideos(videos) {
  // Распределяем видео по категориям на основе названий и содержания
  const categorized = {
    presentation: [],
    personal: [],
    fashion: [],
    sport: []
  };

  videos.forEach(video => {
    const title = video.title.toLowerCase();
    const text = video.postText.toLowerCase();
    
    if (title.includes('презентация') || title.includes('компан') || text.includes('корпоратив')) {
      categorized.presentation.push(video);
    } else if (title.includes('личный') || title.includes('бренд') || text.includes('личност')) {
      categorized.personal.push(video);
    } else if (title.includes('fashion') || title.includes('мода') || text.includes('стиль')) {
      categorized.fashion.push(video);
    } else if (title.includes('спорт') || title.includes('sport') || title.includes('фитнес')) {
      categorized.sport.push(video);
    } else {
      // Распределяем остальные равномерно
      const keys = Object.keys(categorized);
      const smallestCategory = keys.reduce((a, b) => 
        categorized[a].length < categorized[b].length ? a : b
      );
      categorized[smallestCategory].push(video);
    }
  });

  // Создаем финальную структуру плейлистов
  return [
    {
      id: "-229245500_presentation",
      title: "Презентация Компаний",
      description: "Корпоративные фильмы и презентации",
      videoCount: categorized.presentation.length,
      thumbnailUrl: categorized.presentation[0]?.thumbnailUrl || '',
      playlistUrl: `https://vkvideo.ru/@club${GROUP_ID}`,
      videos: categorized.presentation
    },
    {
      id: "-229245500_personal",
      title: "Личный бренд", 
      description: "Работы по созданию личного бренда",
      videoCount: categorized.personal.length,
      thumbnailUrl: categorized.personal[0]?.thumbnailUrl || '',
      playlistUrl: `https://vkvideo.ru/@club${GROUP_ID}`,
      videos: categorized.personal
    },
    {
      id: "-229245500_fashion",
      title: "Fashion",
      description: "Fashion проекты и показы",
      videoCount: categorized.fashion.length,
      thumbnailUrl: categorized.fashion[0]?.thumbnailUrl || '',
      playlistUrl: `https://vkvideo.ru/@club${GROUP_ID}`,
      videos: categorized.fashion
    },
    {
      id: "-229245500_sport", 
      title: "Sport",
      description: "Спортивные проекты и события",
      videoCount: categorized.sport.length,
      thumbnailUrl: categorized.sport[0]?.thumbnailUrl || '',
      playlistUrl: `https://vkvideo.ru/@club${GROUP_ID}`,
      videos: categorized.sport
    }
  ].filter(playlist => playlist.videoCount > 0);
}

// Запускаем
getVKDataAlternative(); 