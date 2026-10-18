import data from "./models.json";
import pets from "./pet-parts.json";
import type { Model3D } from "./types";

/** Optimized copies in /public/models; `source` links each one back to the original asset. */
export const models: Model3D[] = data;

/** Build Your Pet parts library (sockets in pet space, metres, +Y up). */
export const petParts = pets;
export type PetSlot = (typeof pets.slots)[number]["id"];
export type PetElement = (typeof pets.elements)[number]["id"];
export type PetPart = (typeof pets.parts)[number];
export type PetAccessory = (typeof pets.accessories)[number];
