import { useLanguage, type AppLanguage } from '../i18n/LanguageContext';
export default function LanguageSelector(){
  const {language,setLanguage,t}=useLanguage();
  return <label className="language-selector"><span>{t('Idioma')}</span><select value={language} onChange={e=>setLanguage(e.target.value as AppLanguage)} aria-label={t('Idioma')}><option value="es">ES · {t('Español')}</option><option value="ca">CA · {t('Català')}</option><option value="en">EN · {t('English')}</option></select></label>;
}
