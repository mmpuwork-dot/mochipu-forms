declare module '@tabler/icons-react' {
  import type { ComponentType, SVGProps } from 'react';

  export interface TablerIconProps extends Omit<SVGProps<SVGSVGElement>, 'stroke'> {
    size?: number | string;
    color?: string;
    stroke?: number | string;
  }

  export type Icon = ComponentType<TablerIconProps>;

  export const IconRosetteDiscountCheck: Icon;
  // Add more icons here as needed.
}
