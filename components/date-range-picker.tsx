"use client"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { addDays } from "date-fns"

interface DateRangePickerProps {
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  placeholder?: string
}

export function DateRangePicker({ dateRange, onDateRangeChange, placeholder = "期間を選択" }: DateRangePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal ${!dateRange?.from && "text-muted-foreground"}`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "yyyy/MM/dd", { locale: ja })} -{" "}
                {format(dateRange.to, "yyyy/MM/dd", { locale: ja })}
              </>
            ) : (
              format(dateRange.from, "yyyy/MM/dd", { locale: ja })
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={onDateRangeChange}
          numberOfMonths={2}
          locale={ja}
        />
        <div className="flex items-center justify-between p-3 border-t">
          <Button variant="outline" size="sm" onClick={() => onDateRangeChange(undefined)}>
            クリア
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date()
                onDateRangeChange({
                  from: today,
                  to: today,
                })
              }}
            >
              今日
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date()
                onDateRangeChange({
                  from: addDays(today, -7),
                  to: today,
                })
              }}
            >
              過去7日間
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date()
                onDateRangeChange({
                  from: addDays(today, -30),
                  to: today,
                })
              }}
            >
              過去30日間
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
