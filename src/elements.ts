export enum Element {
  Road = '8-66',
  Seaport = '0-92',
  WoodWarehouse = '1-95'
}

export const ElementName = (id: Element): string => {
  switch (id) {
    case Element.Road:
      return 'Road';
    case Element.Seaport:
      return 'Seaport';
    case Element.WoodWarehouse:
      return 'Wood Warehouse';
    default:
      return 'unknown';
  }
}
