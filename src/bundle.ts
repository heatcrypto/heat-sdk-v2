import ByteBuffer from "bytebuffer";
import Long from "long";
import {stringToByteArray} from "./converters"

const MAGIC = 2147483647;
const ASSET_PROPERTIES_SEED = MAGIC - 2;

export interface IHeatBundleAssetProperties {
  asset: string;
  protocol: number;
  value: string;
}

export class AssetPropertiesProtocol1 implements IHeatBundleAssetProperties {
  asset: string;
  protocol: number;
  value: string;
  constructor(asset: string, properties: { symbol: string; name: string; certified?: boolean; }) {
    this.asset = asset;
    this.protocol = 1;
    this.value = JSON.stringify([properties.symbol, properties.name]);
  }
}


export function createAssetProperties(bundle: IHeatBundleAssetProperties): string {
  const buffer = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, true);
  buffer.writeInt32(ASSET_PROPERTIES_SEED);
  buffer.writeInt64(Long.fromString(bundle.asset, true));
  buffer.writeInt32(bundle.protocol);

  const valueBytes = stringToByteArray(bundle.value);
  buffer.writeShort(valueBytes.length);
  valueBytes.forEach((b) => {
    buffer.writeByte(b)
  });

  buffer.flip();
  return buffer.toHex();
}