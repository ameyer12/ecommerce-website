import './home.css';

function Home({navigate}) {
  return (
    <div className='home-card'>
        <h1>Welcome to the e-commerce store!</h1>
        <button 
        className='btn home-button'
        onClick={() => {
          navigate('/products')
        }}
        >Shop Now</button>
    </div>
  );
}

export default Home;