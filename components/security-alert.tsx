"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, X, Eye } from "lucide-react"

interface SecurityAlertProps {
  alert: {
    id: number
    type: string
    title: string
    description: string
    severity: "high" | "medium" | "low"
    timestamp: string
    resolved: boolean
  }
  onResolve: (id: number) => void
  onDismiss: (id: number) => void
}

export function SecurityAlert({ alert, onResolve, onDismiss }: SecurityAlertProps) {
  const [isVisible, setIsVisible] = useState(true)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-200 bg-red-50"
      case "medium":
        return "border-yellow-200 bg-yellow-50"
      case "low":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "low":
        return <Shield className="h-4 w-4 text-blue-600" />
      default:
        return <Shield className="h-4 w-4 text-gray-600" />
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "high":
        return "高"
      case "medium":
        return "中"
      case "low":
        return "低"
      default:
        return severity
    }
  }

  if (!isVisible || alert.resolved) return null

  return (
    <Alert className={`${getSeverityColor(alert.severity)} transition-all duration-300`}>
      {getSeverityIcon(alert.severity)}
      <AlertDescription>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-sm">{alert.title}</h4>
              <Badge variant="outline" className="text-xs">
                {getSeverityText(alert.severity)}
              </Badge>
            </div>
            <p className="text-sm mb-2">{alert.description}</p>
            <p className="text-xs text-gray-500">{alert.timestamp}</p>
          </div>
          <div className="flex items-center space-x-1 ml-4">
            <Button size="sm" variant="outline" onClick={() => onResolve(alert.id)} className="h-8 px-2">
              <Eye className="h-3 w-3 mr-1" />
              確認
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsVisible(false)
                onDismiss(alert.id)
              }}
              className="h-8 w-8 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}
