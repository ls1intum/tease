export const DEVICE_TYPES = ['IPhone', 'IPad', 'Mac', 'Watch'] as const;

export type DeviceType = typeof DEVICE_TYPES[number];

export const DeviceType = {
    IPhone: 'IPhone' as DeviceType,
    IPad: 'IPad' as DeviceType,
    Mac: 'Mac' as DeviceType,
    Watch: 'Watch' as DeviceType,
};

export namespace DeviceTypeUtil {
    export function hasIOS(device: DeviceType) {
        return device === DeviceType.IPad || device === DeviceType.IPhone;
        // apple watches run 'watchOS' (similar to iOS)
    }
}