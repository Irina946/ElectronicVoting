import { JSX } from "react";
import { VideoPlayer } from "../../components/videoPlayer/videoPlayer";

export const Broadcast = (): JSX.Element => {
    return (
        <div className="w-[1016px] m-auto">
            <h1 className="text-[32px] text-(--color-text) my-7">
                Трансляция собрания
            </h1>
            <div className="mb-7">
                <VideoPlayer videoUrl="https://stream.mux.com/S1zlotvu400FxqKdGCIfKMx8GAwQ54qum.m3u8" />
            </div>
        </div>
    )
}