import { DotLoader } from "@/components/ui/dot-loader";
import { TextScramble } from "@/components/ui/text-scramble";

const game = [
    [14, 7, 0, 8, 6, 13, 20],
    [14, 7, 13, 20, 16, 27, 21],
    [14, 20, 27, 21, 34, 24, 28],
    [27, 21, 34, 28, 41, 32, 35],
    [34, 28, 41, 35, 48, 40, 42],
    [34, 28, 41, 35, 48, 42, 46],
    [34, 28, 41, 35, 48, 42, 38],
    [34, 28, 41, 35, 48, 30, 21],
    [34, 28, 41, 48, 21, 22, 14],
    [34, 28, 41, 21, 14, 16, 27],
    [34, 28, 21, 14, 10, 20, 27],
    [28, 21, 14, 4, 13, 20, 27],
    [28, 21, 14, 12, 6, 13, 20],
    [28, 21, 14, 6, 13, 20, 11],
    [28, 21, 14, 6, 13, 20, 10],
    [14, 6, 13, 20, 9, 7, 21],
];

export const Loading = () => {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-transparent">
            <div className="flex items-center gap-5 rounded bg-black px-4 py-3 text-white">
                <DotLoader
                    frames={game}
                    className="gap-0.5"
                    dotClassName="bg-white/15 [&.active]:bg-white size-1.5"
                />
                <TextScramble
                    className="font-medium font-mono text-sm whitespace-pre"
                    duration={1.2}
                    speed={0.08}
                    characterSet=". "
                    loop
                    loopDelay={900}
                >
                    Generating Your Plan...
                </TextScramble>
            </div>
        </div>
    );
};

export default Loading; 