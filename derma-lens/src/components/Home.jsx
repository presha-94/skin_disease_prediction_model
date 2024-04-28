import background from '../assets/background.mp4';
import axios from 'axios';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import info from '../data/info.json';

// import RecommendationApp from "./Recommender.jsx";

const Home = () => {
  const [isloading, setisloading] = useState(false);
  const [imageToShow, setImageToShow] = useState('');
  const [error, setError] = useState('');
  const [prediction, setPrediction] = useState('');
  const [percentage, setPercentage] = useState(0);
  const [links, setLinks] = useState([0]);
  const [file, setFile] = useState(null);

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setisloading(true);
      if (file) {
        const endpoint = 'http://localhost:8000/predict';
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post(endpoint, formData, {
          headers: {
            'Content-Type': [
              'multipart/form-data',
              'boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
            ],
          },
        });

        setPrediction(response.data.prediction);
        setPercentage(response.data.percentage);
        setLinks(info.filter((item) => item.name === response.data.prediction)[0].sitesToRefer);
        console.log(links)
        setImageToShow(URL.createObjectURL(file));
      }
      setisloading(false);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setisloading(false);
        setError(error.response.data.message);
      }
    }
  };

  // const highestProbabilityDisease = prediction[0]
  //   ? prediction.reduce((prev, current) =>
  //       prev.probability > current.probability ? prev : current
  //     ).tagName
  //   : "";

  return (
    <div className='flex'>
      {/* {isloading ? (
        <div className='flex justify-center items-center w-screen h-screen bg-black bg-opacity-100'>
          <div>
            <h1 className='text-2xl'>Loading...</h1>
          </div>
        </div>
      ) : ( */}
      <main className='absolute h-full w-full text-white'>
        <video
          className='object-cover h-full w-full'
          src={background}
          autoPlay
          loop
          muted
        />
        <div className='text-3xl absolute h-full w-full top-0 flex justify-center text-center align gap-48'>
          <div>
            <h1 className='text-5xl text-center font-bold mt-48 mb-12'>
              DermaLens
            </h1>
            <form
              onSubmit={handleSubmit}
              className='flex flex-col items-center'
            >
              <div {...getRootProps()} style={dropzoneStyles}>
                <input {...getInputProps()} />

                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <p>Drag n drop some files here, or click to select files</p>
                )}
              </div>
              {file && (
                <div>
                  <img
                    className='my-5 rounded-lg w-[100px] h-[100px]'
                    src={URL.createObjectURL(file)}
                    alt='Selected'
                  />
                </div>
              )}
              {error && <div className='text-red-500'>{error}</div>}
              {isloading ? (
                <button
                  type='submit'
                  className='text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg px-5 py-2.5 text-center me-2 mb-2 text-2xl'
                  disabled
                >
                  <svg
                    aria-hidden='true'
                    role='status'
                    className='inline w-4 h-4 me-3 text-white animate-spin'
                    viewBox='0 0 100 101'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                      fill='#E5E7EB'
                    />
                    <path
                      d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                      fill='currentColor'
                    />
                  </svg>
                  Loading
                </button>
              ) : (
                <button
                  type='submit'
                  className='text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg px-5 py-2.5 text-center me-2 mb-2 text-2xl'
                >
                  Generate Result
                </button>
              )}
            </form>
          </div>
          {prediction.length > 0 && (
            <div className='flex flex-col items-center justify-center gap-4'>
              <h2 className='text-5xl font-bold text-center'>Results</h2>
              <img
                src={imageToShow}
                alt='Uploaded image'
                className='my-4 max-w-[300px] max-h-[300px] object-contain'
              />

              <p className='text-center'>
                {toTitleCase(prediction)} - {percentage}%
              </p>

              <div className='relative overflow-x-auto'>
                <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                  <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                    <tr>
                      <th scope='col' className='px-6 py-3'>
                        Relative Links
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {links && links.map((link) => (
                    <tr key={link} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                      <th
                        scope='row'
                        className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                      >
                        <a href={link} target='_blank'>{link}</a>
                      </th>
                    </tr>))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* )} */}
    </div>
  );
};

const dropzoneStyles = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  width: '500px',
  marginBottom: '20px',
};

export default Home;
