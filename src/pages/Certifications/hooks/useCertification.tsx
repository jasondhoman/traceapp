import { useQuery } from 'react-query';
import { getCertificate } from '../api/certifications';

const useCertificate = (id?: number) => {
  // usequery to fetch certificate by id
  const {
    data: certificate,
    error,
    status,
  } = useQuery(['certificate', { id }], () => {
    if (id) {
      return getCertificate(id);
    }
    return null;
  });

  if (status === 'loading') {
    return { loading: true };
  }

  if (error) {
    return { error };
  }

  return {
    certifications: certificate,
  };
};

export default useCertificate;
