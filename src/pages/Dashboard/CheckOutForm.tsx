import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TamuModal from '../../components/Modals/TamuModal';
import { useEffect, useState } from 'react';
import InputModal from '../../components/Forms/InputModal';
import SelectJumlahTamuDewasa from '../../components/Forms/SelectGroup/SelectJumlahTamuDewasa';
import SelectJumlahTamuAnak from '../../components/Forms/SelectGroup/SelectJumlahTamuAnak';
import DatePicker from '../../components/Forms/DatePicker/DatePicker';
import TimePicker from '../../components/Forms/DatePicker/TimePicker';
import { Button, Chip, Typography } from '@material-tailwind/react';
import { formatDate } from '../../utils/DateUtils';
import { formatCurrency } from '../../utils/Utility';
import { useModal } from '../../components/Provider/ModalProvider';
import useFetch from '../../hooks/useFetch';
import { CREATE_CHECKIN } from '../../api/routes';
import { API_STATES, MODAL_TYPE } from '../../common/Constants';

const CheckOutForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // parameter
  const stateParameter = location.state;

  const TAMU_DATA = stateParameter?.tamu;
  const KAMAR_DATA = stateParameter?.kamar;

  // state

  // modal state
  const [tamuVisible, setTamuVisible] = useState(false);

  // data state
  const [tamu, setTamu] = useState<any>(TAMU_DATA);
  const [jmlTamuDewasa, setJmlTamuDewasa] = useState(
    stateParameter?.jumlah_dewasa,
  );
  const [jmlTamuAnak, setJmlTamuAnak] = useState(stateParameter?.jumlah_anak);
  const [tanggalCI, setTanggalCI] = useState<any>(stateParameter?.tgl_checkin);
  const [waktuCI, setWaktuCI] = useState<any>(stateParameter?.waktu_checkin);
  const [tanggalCO, setTanggalCO] = useState<any>(stateParameter?.tgl_checkout);
  const [waktuCO, setWaktuCO] = useState<any>(stateParameter?.waktu_checkout);
  const [deposit, setDeposit] = useState<string>(
    stateParameter?.jumlah_deposit,
  );

  // modal
  const { setType, toggle, setOnConfirm } = useModal();

  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDeposit(formatCurrency(inputValue));
  };

  async function onCheckIn() {
    setType(MODAL_TYPE.LOADING);

    const body = {
      tamu_id: tamu?.id,
      jumlah_dewasa: jmlTamuDewasa,
      jumlah_anak: jmlTamuAnak,
      jumlah_deposit: deposit,
      tgl_checkin: tanggalCI,
      waktu_checkin: waktuCI,
      tgl_checkout: tanggalCO,
      waktu_checkout: waktuCO,
      kamar_id: stateParameter?.id,
    };
    const { state, data, error } = await useFetch({
      url: CREATE_CHECKIN,
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      setType(MODAL_TYPE.SUCCESS);
      setOnConfirm(() => {
        navigate('/');
        toggle();
      });
    } else {
      setType(MODAL_TYPE.ERROR);
      setOnConfirm(() => {
        toggle();
      });
    }
  }

  return (
    <>
      <Breadcrumb pageName="Form Pemesanan Kamar" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Kamar Dipilih : {KAMAR_DATA?.nama_kamar} #
                {KAMAR_DATA?.nomor_kamar}
              </h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                <InputModal
                  disabled
                  title="Tamu"
                  placeholder="Pilih Tamu"
                  value={
                    tamu
                      ? `${tamu.sex} ${tamu.nama_depan} ${tamu.nama_belakang} ( ${tamu.alias} )`
                      : ''
                  }
                  onClick={() => setTamuVisible(!tamuVisible)}
                  onXClick={() => setTamu(null)}
                />

                <div className="flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <SelectJumlahTamuDewasa
                      disabled
                      type={'user'}
                      value={jmlTamuDewasa}
                      setValue={setJmlTamuDewasa}
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <SelectJumlahTamuAnak
                      disabled
                      type={'user'}
                      value={jmlTamuAnak}
                      setValue={setJmlTamuAnak}
                    />
                  </div>
                </div>

                <div className="mb-9">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Jumlah Deposit ( Rp )
                  </label>
                  <input
                    disabled
                    type="text"
                    placeholder="Masukan jumlah deposit"
                    value={deposit}
                    onChange={handleDepositChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className=" mb-4.5 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                      Waktu Check In
                    </h3>
                  </div>
                  <div className="flex flex-col gap-5.5 p-6.5">
                    <div className="flex flex-col gap-6 xl:flex-row mb-4.5">
                      <div className="w-full xl:w-1/2">
                        <DatePicker
                          selector="checkin-date"
                          disabled
                          title="Tanggal Check In"
                          value={tanggalCI}
                          onChange={(val: string) => setTanggalCI(val)}
                          defaultValue={stateParameter?.tgl_checkin}
                        />
                      </div>
                      <div className="w-full xl:w-1/2">
                        <TimePicker
                          disabled
                          selector="checkin-time"
                          title="Waktu Check In"
                          value={waktuCI}
                          onChange={(val: string) => setWaktuCI(val)}
                          defaultValue={stateParameter?.waktu_checkin}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                      Waktu Check Out
                    </h3>
                  </div>
                  <div className="flex flex-col gap-5.5 p-6.5">
                    <div className="flex flex-col gap-6 xl:flex-row mb-4.5">
                      <div className="w-full xl:w-1/2">
                        <DatePicker
                          disabled
                          selector="checkout-date"
                          title="Tanggal Check Out"
                          value={tanggalCO}
                          onChange={(val: string) => setTanggalCO(val)}
                        />
                      </div>
                      <div className="w-full xl:w-1/2">
                        <TimePicker
                          disabled
                          selector="checkout-time"
                          title="Waktu Check Out"
                          value={waktuCO}
                          onChange={(val: string) => setWaktuCO(val)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-9">
          {/* <!-- Sign In Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Detail Kamar
              </h3>
            </div>
            <div>
              <div className="p-6.5">
                <div className=" mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Kamar
                  </label>
                  <div className=" flex flex-col gap-y-1">
                    <Typography variant={'small'}>
                      {KAMAR_DATA.nama_kamar} #{KAMAR_DATA.nomor_kamar}
                    </Typography>
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Tipe Kamar
                  </label>
                  <Chip
                    variant="ghost"
                    value={KAMAR_DATA?.tipeKamar?.tipe || 'Tipe Kamar'}
                    color={'blue'}
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Keterangan Layanan / Produk
                  </label>
                  <div className=" flex flex-col gap-y-1">
                    <div className=" flex flex-row justify-between">
                      <Typography variant={'small'}>Harga</Typography>
                      <Typography color={'black'} variant={'small'}>
                        Rp 1.000.000
                      </Typography>
                    </div>
                    <div className=" flex flex-row justify-between">
                      <Typography variant={'small'}>Qty</Typography>
                      <Typography color={'black'} variant={'small'}>
                        1 Malam
                      </Typography>
                    </div>
                    <div className=" flex flex-row justify-between mb-2">
                      <Typography
                        className=" font-semibold text-boxdark-2"
                        variant={'small'}
                      >
                        Sub-Total
                      </Typography>
                      <Typography
                        color={'black'}
                        className=" font-semibold"
                        variant={'small'}
                      >
                        1 Malam
                      </Typography>
                    </div>
                    <div className=" flex flex-row justify-between">
                      <Typography variant={'small'}>PPn 11%</Typography>
                      <Typography color={'black'} variant={'small'}>
                        Rp 1.000.000
                      </Typography>
                    </div>
                    <div className=" flex flex-row justify-between">
                      <Typography variant={'small'}>Jumlah Deposit</Typography>
                      <Typography color={'black'} variant={'small'}>
                        1 Malam
                      </Typography>
                    </div>
                    <div className=" flex flex-row justify-between">
                      <Typography
                        color={'black'}
                        className=" font-semibold text-boxdark-2"
                        variant={'small'}
                      >
                        Grand Total
                      </Typography>
                      <Typography
                        color={'black'}
                        className=" font-semibold"
                        variant={'small'}
                      >
                        1 Malam
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className=" flex flex-row gap-x-4">
                  <Button
                    onClick={() => {
                      setType(MODAL_TYPE.CONFIRMATION);
                      setOnConfirm(() => onCheckIn());
                      toggle();
                    }}
                    color={'blue'}
                    fullWidth
                    className=" mt-8 normal-case"
                  >
                    Check Out
                  </Button>
                  <Button
                    onClick={() => {
                      setType(MODAL_TYPE.CONFIRMATION);
                      setOnConfirm(() => onCheckIn());
                      toggle();
                    }}
                    color={'deep-orange'}
                    fullWidth
                    className=" mt-8 normal-case"
                  >
                    Cetak Invoice
                  </Button>
                </div>
                <Button
                  onClick={() => navigate('/order/checkout')}
                  variant={'outlined'}
                  color={'red'}
                  fullWidth
                  className=" mt-8 normal-case"
                >
                  Batalkan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TamuModal
        visible={tamuVisible}
        toggle={() => setTamuVisible(!tamuVisible)}
        value={(val: string) => setTamu(val)}
      />
    </>
  );
};

export default CheckOutForm;
