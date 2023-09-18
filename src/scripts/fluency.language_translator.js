import FtLanguageTranslatorInputfields from './inputfields/FtLanguageTranslatorInputfields';
import FtConfig from './global/FtConfig';

window.addEventListener('load', e => {
  if (FtConfig.moduleShouldInitialize()) {
    FtLanguageTranslatorInputfields.init();
  }
});
