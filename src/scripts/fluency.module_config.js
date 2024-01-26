import FtAdminMenu from './ui/FtAdminMenu';
import FtTranslationCacheControlButtons from './ui/FtTranslationCacheControlButtons';
import FtTranslatableLanguagesCacheControlButtons from './ui/FtTranslatableLanguagesCacheControlButtons';

window.addEventListener('load', e => {
  FtAdminMenu.init();
  FtTranslationCacheControlButtons.init();
  FtTranslatableLanguagesCacheControlButtons.init();
});
