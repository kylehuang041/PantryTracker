import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigator = useNavigate();

  const handleLogin = () => {
    navigator('/login');
  }

  const handleSignUp = () => {
    navigator('/sign-up');
  }

  const handleMain = () => {
    navigator('/');
  }

  return (
    <nav className="bg-[#050e19] w-full flex justify-between items-center p-4">
      <h1 onClick={handleMain} className="text-2xl font-bold cursor-pointer">Pantry Tracker</h1>
      <ul className="flex gap-4 items-center">
        <li>
          <button onClick={handleLogin} className="px-6 py-2 bg-black text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400">
            Login
          </button>
        </li>
        <li>
          <button onClick={handleSignUp} className="p-[3px] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
            <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
              Sign Up
            </div>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
