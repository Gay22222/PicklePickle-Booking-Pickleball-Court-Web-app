export default function BookingHistoryFilter({ sort, onChangeSort }) {
  return (
    <div className="flex justify-end mb-6">
      <label className="mr-2 text-sm font-medium">Sắp xếp theo</label>
      <select
        value={sort}
        onChange={e => onChangeSort(e.target.value)}
        className="px-3 py-2 rounded bg-gray-200 text-sm"
      >
        <option value="newest">Mới nhất</option>
        <option value="oldest">Cũ nhất</option>
      </select>
    </div>
  );
}