import { Badge } from "@/components/ui/badge"

export const dollarPeso = 57

export const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
    }
    return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Banned</Badge>
  }