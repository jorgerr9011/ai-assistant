import { Incidencia } from '@/types/Incidence'

const orderByDate = (listInc: Incidencia[], orden: string): Incidencia[] => {

    return listInc.sort((a, b) => {

        const fechaA = new Date(a.createdAt).getTime();
        const fechaB = new Date(b.createdAt).getTime();

        if (orden === "ascendente") {
            return fechaA - fechaB
        } else {
            return fechaB - fechaA
        }
    })
}

const orderByName = (listInc: Incidencia[], orden: string): Incidencia[] => {

    return listInc.sort((a, b) => {
        const nombreA = a.name.toLowerCase()
        const nombreB = b.name.toLowerCase()

        if (orden === "ascendente") {
            if (nombreA < nombreB) return -1
            if (nombreA > nombreB) return 1
            return 0
        } else {
            if (nombreB < nombreA) return -1
            if (nombreB > nombreA) return 1
            return 0
        }
    })
}

const orderByStatus = (listInc: Incidencia[], orden: string): Incidencia[] => {

    return listInc.sort((a, b) => {
        const statusA = a.status.toLowerCase()
        const statusB = b.status.toLowerCase()

        if (orden === "ascendente") {
            if (statusA < statusB) return -1
            if (statusA > statusB) return 1
            return 0
        } else {
            if (statusB < statusA) return -1
            if (statusB > statusA) return 1
            return 0
        }
    })
}

export const getOrder = (listInc: Incidencia[], orden: string, selectedOrder: string): Incidencia[] => {
    let list: Incidencia[]

    switch (selectedOrder) {
        case "createdAt":
            return list = orderByDate(listInc, orden)
        case "name":
            return list = orderByName(listInc, orden)
        case "status":
            return list = orderByStatus(listInc, orden)
        default:
            return list = orderByDate(listInc, "ascendente")
    }
}

