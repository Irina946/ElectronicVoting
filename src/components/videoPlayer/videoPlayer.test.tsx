import { render, screen, fireEvent } from '@testing-library/react';
import { VideoPlayer } from './videoPlayer';

// Мокаем SVG импорты
jest.mock('../../assets/play.svg', () => 'play-mock');
jest.mock('../../assets/pause.svg', () => 'pause-mock');
jest.mock('../../assets/setting.svg', () => 'setting-mock');
jest.mock('../../assets/fullscreen.svg', () => 'fullscreen-mock');

describe('VideoPlayer Component', () => {
    const mockVideoUrl = 'https://example.com/video.mp4';

    beforeEach(() => {
        // Мокаем методы HTMLVideoElement
        Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
            configurable: true,
            value: jest.fn()
        });
        Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
            configurable: true,
            value: jest.fn()
        });
        Object.defineProperty(window.HTMLMediaElement.prototype, 'duration', {
            configurable: true,
            get: () => 100
        });
        Object.defineProperty(window.HTMLMediaElement.prototype, 'currentTime', {
            configurable: true,
            get: () => 50,
            set: jest.fn()
        });
        Object.defineProperty(window.HTMLMediaElement.prototype, 'volume', {
            configurable: true,
            get: () => 1,
            set: jest.fn()
        });
        document.exitFullscreen = jest.fn();
        HTMLVideoElement.prototype.requestFullscreen = jest.fn();
    });

    it('renders video player with correct url', () => {
        render(<VideoPlayer videoUrl={mockVideoUrl} />);
        const video = screen.getByTestId('video-player');
        expect(video).toHaveAttribute('src', mockVideoUrl);
    });

    it('toggles play/pause when button is clicked', () => {
        render(<VideoPlayer videoUrl={mockVideoUrl} />);
        const playButton = screen.getByAltText('Play');
        
        fireEvent.click(playButton.parentElement!);
        expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
    });

    it('updates time display when video plays', () => {
        render(<VideoPlayer videoUrl={mockVideoUrl} />);
        const video = screen.getByTestId('video-player');
        
        fireEvent.timeUpdate(video);
        expect(screen.getByText('Эфир: 00:50')).toBeInTheDocument();
    });

    it('toggles volume control visibility', () => {
        render(<VideoPlayer videoUrl={mockVideoUrl} />);
        const volumeButton = screen.getByTestId('volume-button');
        
        fireEvent.click(volumeButton);
        const volumeSlider = screen.getByTestId('volume-slider');
        expect(volumeSlider).toBeInTheDocument();
        
        fireEvent.click(volumeButton);
        expect(screen.queryByTestId('volume-slider')).not.toBeInTheDocument();
    });

    it('toggles fullscreen when button is clicked', () => {
        render(<VideoPlayer videoUrl={mockVideoUrl} />);
        const fullscreenButton = screen.getByAltText('Расширить экран');
        
        fireEvent.click(fullscreenButton.parentElement!);
        expect(HTMLVideoElement.prototype.requestFullscreen).toHaveBeenCalled();
        
        Object.defineProperty(document, 'fullscreenElement', {
            configurable: true,
            value: true
        });
        fireEvent.click(fullscreenButton.parentElement!);
        expect(document.exitFullscreen).toHaveBeenCalled();
    });

    it('updates volume when slider is moved', () => {
        render(<VideoPlayer videoUrl={mockVideoUrl} />);
        const volumeButton = screen.getByTestId('volume-button');
        fireEvent.click(volumeButton);
        
        const volumeSlider = screen.getByTestId('volume-slider');
        fireEvent.change(volumeSlider, { target: { value: '0.5' } });
        
        expect(volumeSlider).toHaveValue('0.5');
    });

    it('updates progress when seek slider is moved', () => {
        render(<VideoPlayer videoUrl={mockVideoUrl} />);
        const seekSlider = screen.getByTestId('seek-slider');
        const video = screen.getByTestId('video-player') as HTMLVideoElement;
        
        // Имитируем загрузку метаданных видео
        Object.defineProperty(video, 'duration', { value: 100 });
        fireEvent.loadedMetadata(video);
        
        // Имитируем изменение времени
        fireEvent.change(seekSlider, { target: { value: '30' } });
        expect(seekSlider).toHaveValue('30');
    });
}); 