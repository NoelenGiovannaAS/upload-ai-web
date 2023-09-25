import { getFFMpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
export async function convertVideoToAudio(video: File) {
  const ffmpeg = await getFFMpeg();
  await ffmpeg.writeFile("input.mp4", await fetchFile(video));

  //ffmpeg.on('log', log => {
  //  console.log
  //})

  ffmpeg.on("progress", (progress) => {
    console.log("Convert progress: " + Math.round(progress.progress * 100));
  });

  ffmpeg.exec([
    "-i",
    "input.mp4",
    "-map",
    "0:a",
    "-b:a",
    "20k",
    "-acodec",
    "libmp3lame",
    "output.mp3",
  ]);

  const data = await ffmpeg.readFile("output.mp3");

  //convertendo esse fileData em eum file do javascript
  const audioFileBlob = new Blob([data], { type: "audio/mpeg" });
  const audioFile = new File([audioFileBlob], "audio.mp3", {
    type: "audio/mpeg",
  });

  return audioFile;
}
