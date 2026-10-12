export const FeeStatus = {
  PAID: 'PAID',
  PENDING: 'PENDING',
  OVERDUE: 'OVERDUE',
}

export const RoomStatus = {
  AVAILABLE: 'AVAILABLE',
  FULL: 'FULL',
  MAINTENANCE: 'MAINTENANCE',
}

export const MealType = {
  BREAKFAST: 'BREAKFAST',
  LUNCH: 'LUNCH',
  DINNER: 'DINNER',
}

export const AttendanceStatus = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
}

export const ComplaintCategory = {
  PLUMBING: 'PLUMBING',
  ELECTRICAL: 'ELECTRICAL',
  CLEANING: 'CLEANING',
  INTERNET: 'INTERNET',
  OTHER: 'OTHER',
}

export const ComplaintStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
}

export const feeStatusColors = {
  [FeeStatus.PAID]: 'badge-success',
  [FeeStatus.PENDING]: 'badge-warning',
  [FeeStatus.OVERDUE]: 'badge-danger',
}

export const roomStatusColors = {
  [RoomStatus.AVAILABLE]: 'badge-success',
  [RoomStatus.FULL]: 'badge-danger',
  [RoomStatus.MAINTENANCE]: 'badge-warning',
}

export const complaintStatusColors = {
  [ComplaintStatus.PENDING]: 'badge-warning',
  [ComplaintStatus.IN_PROGRESS]: 'badge-info',
  [ComplaintStatus.RESOLVED]: 'badge-success',
}

export const complaintCategoryLabels = {
  [ComplaintCategory.PLUMBING]: 'Plumbing',
  [ComplaintCategory.ELECTRICAL]: 'Electrical',
  [ComplaintCategory.CLEANING]: 'Cleaning',
  [ComplaintCategory.INTERNET]: 'Internet',
  [ComplaintCategory.OTHER]: 'Other',
}

export const mealTypeLabels = {
  [MealType.BREAKFAST]: 'Breakfast',
  [MealType.LUNCH]: 'Lunch',
  [MealType.DINNER]: 'Dinner',
}