import FtInputfields from './inputfields/FtInputfields';
import FtAdminMenu from './ui/FtAdminMenu';

// Each module has its own checks to determine if they should initialize
window.addEventListener('load', e => {
  FtAdminMenu.init();
  FtInputfields.init();
});
