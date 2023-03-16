import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdjustIcon from '@mui/icons-material/Adjust';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BusinessIcon from '@mui/icons-material/Business';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DescriptionIcon from '@mui/icons-material/Description';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SettingsIcon from '@mui/icons-material/Settings';
import StoreIcon from '@mui/icons-material/Store';
import React, { useEffect, useState } from 'react';

interface IIcoString {
  ico_string: string;
}

export const Icon: React.FC<IIcoString> = ({ ico_string }) => {
  if (ico_string === undefined) ico_string = 'unknown';

  const [ico, setIco] = useState<any>();

  useEffect(() => {
    switch (ico_string) {
      case 'descriptionicon':
        setIco(<DescriptionIcon />);
        break;

      case 'personaddicon':
        setIco(<PersonAddIcon />);
        break;

      case 'logouticon':
        setIco(<LogoutIcon />);
        break;

      case 'accountcircleicon':
        setIco(<AccountCircleIcon />);
        break;

      case 'homeicon':
        setIco(<HomeIcon />);
        break;

      case 'settingsicon':
        setIco(<SettingsIcon />);
        break;

      case 'adjusticon':
        setIco(<AdjustIcon />);
        break;

      case 'attachmoneyicon':
        setIco(<AttachMoneyIcon />);
        break;

      case 'businessicon':
        setIco(<BusinessIcon />);
        break;

      case 'localshippingicon':
        setIco(<LocalShippingIcon />);
        break;

      case 'receipticon':
        setIco(<ReceiptIcon />);
        break;

      case 'storeicon':
        setIco(<StoreIcon />);
        break;

      case 'chevronlefticon':
        setIco(<ChevronLeftIcon />);
        break;

      case 'chevronrighticon':
        setIco(<ChevronRightIcon />);
        break;

      default:
        setIco(<HomeIcon />);
    }
  }, [ico_string]);
  return <>{ico}</>;
};
