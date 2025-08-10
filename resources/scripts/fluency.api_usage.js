import FtApiUsageTableFieldset from './components/FtApiUsageTableFieldset';
import FtConfig from './global/FtConfig';

window.addEventListener('load', e => {
  if (FtConfig.getEngineProvidesUsageData()) {
    FtApiUsageTableFieldset.init();
  }
});
