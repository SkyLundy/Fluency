import FtInputfields from './inputfields/FtInputfields';
import FtAdminMenu from './ui/FtAdminMenu';
import FtConfig from './global/FtConfig';

// Each module has its own checks to determine if they should initialize
window.addEventListener('load', e => {
  if (FtConfig.moduleShouldInitialize()) {
    FtAdminMenu.init();
    FtInputfields.init();
  }
});
