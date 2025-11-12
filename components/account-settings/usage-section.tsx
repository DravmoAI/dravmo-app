"use client"

export default function UsageSection() {
  const usageData = [
    { label: "Storage", used: 45, total: 100, color: "from-cyan-500 to-blue-500" },
    { label: "Bandwidth", used: 60, total: 200, color: "from-blue-500 to-purple-500" },
    { label: "API Calls", used: 8500, total: 10000, color: "from-purple-500 to-pink-500" },
  ]

  return (
    <div className="space-y-6">
      {usageData.map((item, index) => (
        <div key={index}>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-white">{item.label}</span>
            <span className="text-sm text-white/60">
              {item.used} / {item.total} {item.label === "API Calls" ? "calls" : item.label === "Storage" ? "GB" : "GB"}
            </span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${item.color} transition-all duration-500`}
              style={{ width: `${(item.used / item.total) * 100}%` }}
            />
          </div>
        </div>
      ))}

      <div className="mt-8 pt-6 border-t border-white/10 bg-white/5 rounded-lg p-4">
        <h4 className="text-sm font-medium text-white mb-2">Usage Tips</h4>
        <ul className="text-xs text-white/70 space-y-2">
          <li>• Archive old files to free up storage</li>
          <li>• Cache API responses to reduce calls</li>
          <li>• Upgrade your plan for more resources</li>
        </ul>
      </div>
    </div>
  )
}
