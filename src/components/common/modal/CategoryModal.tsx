import type { SongData } from "@/api/songdb";
import SongListModal from "@/components/common/modal/SongListModal";

type CategoryModalProps = {
  songs: SongData[];
  categoryName: string;
};

export default function CategoryModal({
  songs,
  categoryName,
}: CategoryModalProps) {
  return (
    <SongListModal
      songs={songs}
      filterName={categoryName}
      filterType="category"
    />
  );
}
