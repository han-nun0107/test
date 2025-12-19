import type { SongData } from "@/api/songdb";
import SongListModal from "@/components/common/modal/SongListModal";

type SingerModalProps = {
  songs: SongData[];
  singerName?: string;
};

export default function SingerModal({ songs }: SingerModalProps) {
  return <SongListModal songs={songs} filterType="singer" />;
}
