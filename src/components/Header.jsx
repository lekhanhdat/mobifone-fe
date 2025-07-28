import user from '../assets/user.svg';
import searchIcon from '../assets/search-icon.svg';
import dropdownIcon from '../assets/dropdown-icon.svg';

const Header = () => {
  return (
    <header className="fixed top-0 left-64 right-0 bg-white shadow-md p-4 flex items-center justify-between z-10">
      <div className="relative flex items-center">
        <div className="relative w-64">
            <img
            src={searchIcon}
            alt="Search icon"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
            />
            <input
            type="text"
            placeholder="Search"
            className="bg-gray-100 rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <span className="text-gray-700 mr-1">Tiếng Việt</span>
          <img src={dropdownIcon} alt="Dropdown icon" className="w-3 h-3" />
        </div>
        <div className="relative">
          <span className="text-blue-500">🔔</span>
          <span className="absolute top-0 right-0 bg-red-500 rounded-full w-2 h-2"></span>
        </div>
        <div className="flex items-center">
          <img
            src={user}
            alt="Moni Roy"
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <span className="font-bold">Dat Le Khanh</span>
            <span className="text-gray-500 block text-sm">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;