import { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { KamarCard } from '../../components/Card/KamarCard';
import useFetch from '../../hooks/useFetch';
import { GET_READY_KAMAR } from '../../api/routes';
import { API_STATES, MODAL_TYPE } from '../../common/Constants';
import { useModal } from '../../components/Provider/ModalProvider';
import { Input } from '@material-tailwind/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const CheckInSelectKamar = () => {
  const [kamarReady, setKamarReady] = useState([]);
  const [cari, setCari] = useState('');

  // modal
  const { setType, toggle } = useModal();

  useEffect(() => {
    getReadyKamar();
  }, []);

  async function getReadyKamar() {
    setType(MODAL_TYPE.LOADING);
    toggle();

    const { state, data, error } = await useFetch({
      url: GET_READY_KAMAR(1, 100, cari),
    });

    if (state == API_STATES.OK) {
      toggle();
      setKamarReady(data.data);
    } else {
      toggle();
      setKamarReady([]);
    }
  }

  // Handle search input and fetch rooms on Enter key press
  const handleSearch = (e: any) => {
    if (e.key === 'Enter') {
      getReadyKamar();
    }
  };

  return (
    <>
      <Breadcrumb pageName="Pilih Kamar Tersedia" />

      <div className="flex justify-between items-center mb-4">
        <div></div> {/* Empty div to push search bar to the right */}
        <div className="w-full md:w-72">
          <Input
            label="Cari"
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            onKeyDown={handleSearch} // Trigger search on Enter key press
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-y-3 gap-x-8 sm:grid-cols-4">
        {kamarReady.map((item, index) => {
          return <KamarCard navTo="/order/checkin/form" stateData={item} />;
        })}
      </div>
    </>
  );
};

export default CheckInSelectKamar;
