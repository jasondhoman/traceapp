import { useEffect } from 'react';
import { getGradeMixList } from '../api/reporting';

const GradeMixList = () => {
  useEffect(() => {
    getGradeMixList();
    // .then(async (data) => {
    // const file = new Blob([data], { type: "application/pdf" });
    // //Build a URL from the file
    // const fileURL = URL.createObjectURL(file);
    // //Open the URL on new Window
    // window.open(fileURL, "_self");
    // //   }
    // // });
    // });
  }, []);
};
export default GradeMixList;
