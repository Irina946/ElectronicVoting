import { JSX, useRef, useState } from "react";
import play from "../../assets/play.svg";
import styles from "./videoPlayer.module.css";
import setting from "../../assets/setting.svg";
import fullscreen from "../../assets/fullscreen.svg"
import pause from "../../assets/pause.svg"

export const VideoPlayer: React.FC<{ videoUrl: string }> = ({ videoUrl }): JSX.Element => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [showVolumeControl, setShowVolumeControl] = useState(false);

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current) {
            videoRef.current.currentTime = parseFloat(e.target.value);
            setCurrentTime(parseFloat(e.target.value));
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current) {
            videoRef.current.volume = parseFloat(e.target.value);
            setVolume(parseFloat(e.target.value));
        }
    };

    const toggleVolumeControl = () => {
        setShowVolumeControl(!showVolumeControl);
    };

    const toggleFullScreen = () => {
        if (videoRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoRef.current.requestFullscreen();
            }
        }
    };

    return (
        <div className="w-[908px] h-[438px] bg-gray outline-[0.5px] outline-(--color-text)">
            <video
                className="w-full h-[368px]"
                ref={videoRef}
                src={videoUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                data-testid="video-player"
            />
            <div className="
                            text-(--color-gray-video)
                            px-7
                            py-2
                            ">
                <div className="flex items-center space-x-4 w-full mb-4">
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        step="any"
                        value={currentTime}
                        onChange={handleSeek}
                        className={`${styles.slider} min-w-[850px]`}
                        data-testid="seek-slider"
                    />
                </div>
                <div className="
                            flex 
                            items-center 
                            justify-between
                            text-(--color-gray-video)
                            px-3.5
                            ">
                    <div className="flex items-center space-x-4 relative">
                        <button onClick={togglePlayPause} className="cursor-pointer w-[24px]">
                            {isPlaying
                                ? <img src={pause} alt="Pause" />
                                : <img src={play} alt="Play" />
                            }
                        </button>
                        <button onClick={toggleVolumeControl} className="text-(--color-gray-video) cursor-pointer" data-testid="volume-button">
                            {volume === 0 ? (
                                <svg width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.4872 0.0936904C17.327 0.0191449 17.15 -0.0117878 16.974 0.00402866C16.798 0.0198451 16.6293 0.0818481 16.4851 0.183752L8.68848 5.98771H1.00213C0.736349 5.98771 0.481453 6.09314 0.293517 6.2808C0.105581 6.46847 0 6.723 0 6.98839V16.9952C0 17.2606 0.105581 17.5151 0.293517 17.7028C0.481453 17.8905 0.736349 17.9959 1.00213 17.9959H8.68848L16.4349 23.7999C16.5838 23.9114 16.7609 23.9793 16.9462 23.996C17.1316 24.0126 17.3179 23.9775 17.4844 23.8944C17.6509 23.8112 17.7908 23.6835 17.8887 23.5254C17.9865 23.3673 18.0384 23.1852 18.0384 22.9993V0.984298C18.0378 0.799504 17.986 0.618475 17.8887 0.461276C17.7914 0.304076 17.6525 0.176847 17.4872 0.0936904Z" fill="#8A8A8A" />
                                </svg>
                            ) : volume > 0 && volume <= 0.5 ? (
                                <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.4872 0.0936904C17.327 0.0191449 17.15 -0.0117878 16.974 0.00402866C16.798 0.0198451 16.6293 0.0818481 16.4851 0.183752L8.68848 5.98771H1.00213C0.736349 5.98771 0.481453 6.09314 0.293517 6.2808C0.105581 6.46847 0 6.723 0 6.98839V16.9952C0 17.2606 0.105581 17.5151 0.293517 17.7028C0.481453 17.8905 0.736349 17.9959 1.00213 17.9959H8.68848L16.4349 23.7999C16.5838 23.9114 16.7609 23.9793 16.9462 23.996C17.1316 24.0126 17.3179 23.9775 17.4844 23.8944C17.6509 23.8112 17.7908 23.6835 17.8887 23.5254C17.9865 23.3673 18.0384 23.1852 18.0384 22.9993V0.984298C18.0378 0.799504 17.986 0.618475 17.8887 0.461276C17.7914 0.304076 17.6525 0.176847 17.4872 0.0936904Z" fill="#8A8A8A" />
                                    <path d="M20.0641 20C19.8372 20 19.6244 19.9158 19.4259 19.7474C18.9578 19.3263 18.8586 18.5348 19.2131 17.979C21.4399 14.4591 21.4399 9.54135 19.2131 6.02145C18.8586 5.46568 18.9578 4.67412 19.4259 4.25308C19.8939 3.83204 20.5605 3.94993 20.9151 4.50571C23.695 8.91821 23.695 15.0822 20.9151 19.4948C20.7024 19.8316 20.3903 20 20.0641 20Z" fill="#8A8A8A" />
                                </svg>
                            ) : (
                                <svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.4872 0.0936904C17.327 0.0191449 17.15 -0.0117878 16.974 0.00402866C16.798 0.0198451 16.6293 0.0818481 16.4851 0.183752L8.68848 5.98771H1.00213C0.736349 5.98771 0.481453 6.09314 0.293517 6.2808C0.105581 6.46847 0 6.723 0 6.98839V16.9952C0 17.2606 0.105581 17.5151 0.293517 17.7028C0.481453 17.8905 0.736349 17.9959 1.00213 17.9959H8.68848L16.4349 23.7999C16.5838 23.9114 16.7609 23.9793 16.9462 23.996C17.1316 24.0126 17.3179 23.9775 17.4844 23.8944C17.6509 23.8112 17.7908 23.6835 17.8887 23.5254C17.9865 23.3673 18.0384 23.1852 18.0384 22.9993V0.984298C18.0378 0.799504 17.986 0.618475 17.8887 0.461276C17.7914 0.304076 17.6525 0.176847 17.4872 0.0936904Z" fill="#8A8A8A" />
                                    <path d="M20.0641 20C19.8372 20 19.6244 19.9158 19.4259 19.7474C18.9578 19.3263 18.8586 18.5348 19.2131 17.979C21.4399 14.4591 21.4399 9.54135 19.2131 6.02145C18.8586 5.46568 18.9578 4.67412 19.4259 4.25308C19.8939 3.83204 20.5605 3.94993 20.9151 4.50571C23.695 8.91821 23.695 15.0822 20.9151 19.4948C20.7024 19.8316 20.3903 20 20.0641 20Z" fill="#8A8A8A" />
                                    <path d="M24.027 24C23.808 24 23.6027 23.9172 23.411 23.7517C22.9593 23.3379 22.8635 22.56 23.2057 22.0138C26.8605 16.1215 26.8605 7.87892 23.2057 1.98662C22.8635 1.44042 22.9593 0.662508 23.411 0.248723C23.8627 -0.165063 24.5061 -0.0492026 24.8483 0.496994C29.0506 7.26652 29.0506 16.7339 24.8483 23.5035C24.6567 23.8345 24.3418 24 24.027 24Z" fill="#8A8A8A" />
                                </svg>
                            )}
                        </button>
                        {showVolumeControl && (
                            <div className="
                                        absolute 
                                        bottom-12 
                                        transform 
                                        -translate-y-1/2 
                                        bg-(--color-background)
                                        p-2 
                                        rounded 
                                        shadow
                                        -rotate-90
                                        flex
                                        items-center
                                        h-[36px]
                                        ">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className={`${styles.slider}`}
                                    data-testid="volume-slider"
                                />
                            </div>
                        )}
                        <span className="ml-[70px] text-sm text-(--color-text)">
                            Эфир: {String(Math.floor(currentTime / 60)).padStart(2, '0')}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
                        </span>
                    </div>
                    <div className="text-(--color-gray-video)">
                        <button className="mr-5 cursor-pointer"><img src={setting} alt="Настройки" /></button>
                        <button onClick={toggleFullScreen} className="cursor-pointer"><img src={fullscreen} alt="Расширить экран" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};