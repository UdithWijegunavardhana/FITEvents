export const SCAN_LABELS = {
  hint: 'Point the camera at an event QR code',
  invalidCode: 'This QR code is not a FIT Events link',
  checking: 'Checking camera access',
};

export const CAMERA_PERMISSION_PROMPTS = {
  denied: {
    title: 'Camera access needed',
    message: 'Allow camera access to scan event QR codes.',
    action: 'Allow camera',
  },
  blocked: {
    title: 'Camera access is off',
    message: 'Turn on camera access for FIT Events in Settings.',
    action: 'Open settings',
  },
  unavailable: {
    title: 'No camera available',
    message: 'This device has no camera FIT Events can use.',
  },
};
