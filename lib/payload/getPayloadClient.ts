import { getPayload, type Payload } from 'payload'
import config from '@payload-config'

let clientPromise: Promise<Payload> | null = null

export function getPayloadClient(): Promise<Payload> {
  if (!clientPromise) {
    clientPromise = getPayload({ config })
  }
  return clientPromise
}
