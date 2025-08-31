import { CiGrid41 } from 'react-icons/ci';
import { FaTshirt, FaSocks } from 'react-icons/fa';
import { GiUnderwearShorts, GiBilledCap } from 'react-icons/gi';
import { PiSneakerMoveFill } from 'react-icons/pi';
import { FC } from 'react';

export interface SuggestedIcon {
  key: string;
  icon: FC;
}

export const suggestedIcons: SuggestedIcon[] = [
  { key: 'ver todo', icon: CiGrid41 },
  { key: 'zapatillas', icon: PiSneakerMoveFill },
  { key: 'camisas', icon: FaTshirt },
  { key: 'pantalonetas', icon: GiUnderwearShorts },
  { key: 'medias', icon: FaSocks },
  { key: 'accesorios', icon: GiBilledCap },
];
