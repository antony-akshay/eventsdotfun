export default function Ticket() {
  const scallopCount = 15; // Matches your original 25 circles

  return (
      <div className="relative bg-white w-[500px] h-[250px] overflow-hidden">
        {/* Top Scalloped Edge */}
        <div className="absolute top-0 left-0 right-0 h-2 flex -translate-y-1/2 z-10">
          {Array.from({ length: scallopCount }).map((_, i) => (
            <div
              key={`top-${i}`}
              className="w-4 h-4 bg-[#f9f6ef] rounded-full flex-shrink-0"
              style={{ marginLeft: i === 0 ? 0 : '16px' }}
            />
          ))}
        </div>

        {/* Bottom Scalloped Edge */}
        <div className="absolute bottom-0 left-0 right-0 h-2 flex translate-y-6/2 z-10">
          {Array.from({ length: scallopCount }).map((_, i) => (
            <div
              key={`bottom-${i}`}
              className="w-4 h-4 bg-[#f9f6ef] rounded-full flex-shrink-0"
              style={{ marginLeft: i === 0 ? 0 : '16px' }}
            />
          ))}
        </div>

        {/* Left Corner Semicircles (Cutouts) */}
        <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#f9f6ef] rounded-full z-20" />
        <div className="absolute left-0 bottom-0 -translate-x-1/2 translate-y-1/2 w-8 h-8 bg-[#f9f6ef] rounded-full z-20" />

        {/* Right Large Semicircle Cutout */}
        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#f9f6ef] rounded-full z-20" />

        {/* Ticket Content */}
        <div className="flex h-full relative z-5">
          {/* Left: Image Box */}
          <div className="w-2/5 flex items-center justify-center p-6">
            <div className="w-[120px] h-[120px] bg-gradient-to-br from-red-900 to-red-950 rounded-lg flex items-center justify-center overflow-hidden">
              <span className="text-5xl text-white/50">🎭</span>
            </div>
          </div>

          {/* Right: Event Details */}
          <div className="w-3/5 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Summer Music Festival
              </h2>
              <p className="text-sm text-gray-600">
                Join us for an amazing evening of live music
              </p>
              <p className="text-sm text-gray-500">
                balance_tickets:{' '}
                <span className="font-semibold text-gray-800">3</span>
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to cancel this ticket?')) {
                    alert('Ticket cancelled successfully');
                  }
                }}
                className="px-6 py-2 border-2 border-red-500 text-red-500 rounded-lg font-semibold uppercase text-sm hover:bg-red-500 hover:text-white transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}