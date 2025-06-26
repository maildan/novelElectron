// TODO: Loop strict 규칙에 맞게 유틸/네이밍/공유 구조 리팩터링 필요
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "진행중":
      return "bg-blue-100 text-blue-800"
    case "초안":
      return "bg-slate-100 text-slate-800"
    case "검토중":
      return "bg-yellow-100 text-yellow-800"
    case "완료":
      return "bg-green-100 text-green-800"
    default:
      return "bg-purple-100 text-purple-800"
  }
}

export const getColorClasses = (color: string): string => {
  switch (color) {
    case "blue":
      return "bg-blue-100 text-blue-600"
    case "green":
      return "bg-green-100 text-green-600"
    case "purple":
      return "bg-purple-100 text-purple-600"
    case "orange":
      return "bg-orange-100 text-orange-600"
    case "red":
      return "bg-red-100 text-red-600"
    case "yellow":
      return "bg-yellow-100 text-yellow-600"
    default:
      return "bg-slate-100 text-slate-600"
  }
} 