import FtStandaloneTranslatorFieldset from './components/FtStandaloneTranslatorFieldset';
import FtConfig from './global/FtConfig';

window.addEventListener('load', e => {
  if (FtConfig.moduleShouldInitialize()) {
    FtStandaloneTranslatorFieldset.init();
  }
});
