export type MediaType = 'video' | 'iframe';

export interface MediaContent {
  type: MediaType;
  src: string;
}

export interface MediaProps {
  src: string;
  isHovered: boolean;
}

export interface FrameProps {
  children: React.ReactNode;
  showFrame: boolean;
  borderThickness: number;
  borderSize: number;
  title?: string;
}

export interface FrameItemProps {
  frame: Frame;
  showFrame: boolean;
  isHovered: boolean;
  onHover: (hover: { id: number; row: number; col: number } | null) => void;
}

export interface Frame {
  id: number;
  media: MediaContent;
  mediaSize: number;
  borderThickness: number;
  borderSize: number;
  position: { row: number; col: number };
  title?: string;
}

export interface MediaProviderProps {
  type: MediaType;
  src: string;
  isHovered: boolean;
}

export interface DynamicFrameLayoutProps {
  frames: Frame[];
  showFrames?: boolean;
  hoverSize?: number;
  gapSize?: number;
  className?: string;
} 