import { IonBadge } from "@ionic/react"

export const dollarPeso = 57

export const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <IonBadge color="success">Active</IonBadge>
    }
    return <IonBadge color="danger">Banned</IonBadge>
  }