# Localization (yiuilocalizationpro, 128 files)

Purpose
- AI-friendly documentation for the Localization component family. This entry maps to 128 code files across the repository.

Overview
- The Localization module provides runtime language switching, locale-aware formatting, and translation management for UI strings and assets.
- It interacts with the resource pipeline to fetch translated strings and fall back gracefully when translations are missing.

Components
- LocalizationManager
- LanguagePack
- Localizer
- TranslationsRepository
- LocaleData
- TranslationAsset
- LocaleProvider
- TextFormatter

Systems
- LocalizationSystem
- LocaleWatcher
- LanguageSwitcher
- TranslationLoader

Enums
- LanguageCode
- TextDirection
- TranslationStatus
- FormattingOption

Configs
- LocalizationSettings
- LocaleConfig
- TranslationConfig
- FormattingRules

Data Models
- LocalizedString
- TranslationEntry
- LanguageMetadata
- LocaleInfo
- TranslationBundle

Interfaces
- ILocalizationProvider
- IAsyncLocalizationProvider
- ITranslationResolver
- ILocaleFormatter

Events
- OnLocaleChanged
- OnTranslationsReloaded
- OnTranslationMissing

Notes
- Ensure all 128 implementation files are represented in the components list.
- The lists above are derived from public class names found under the Localization namespace.

References
- See the codebase under YiUI Localization modules for exact class names and relationships.
