/* =========================================================
   GestDette — Debt & Seller Management
   Vanilla JS SPA · FR/AR (RTL) · Supabase backend (+ offline demo)
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     0. CONFIG / CURRENCY
     --------------------------------------------------------- */
  const CFG = window.APP_CONFIG || {};
  const CURRENCY = CFG.CURRENCY || 'DZD';

  let sb = null;
  function getSb() {
    if (sb) return sb;
    if (!window.supabase || !CFG.SUPABASE_URL || !CFG.SUPABASE_ANON_KEY) return null;
    sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' },
    });
    return sb;
  }

  /* ---------------------------------------------------------
     1. TRANSLATIONS
     --------------------------------------------------------- */
  const I18N = {
    fr: {
      appName: 'GestDette', tagline: 'Gestion des dettes & clients',
      welcome: 'Bienvenue', signInSub: 'Connectez-vous pour gérer votre boutique',
      createAccountSub: 'Créez votre compte administrateur',
      login: 'Connexion', register: 'Créer un compte',
      fullName: 'Nom complet', username: 'Nom d’utilisateur', email: 'E-mail',
      password: 'Mot de passe', confirmPassword: 'Confirmer le mot de passe',
      loginBtn: 'Se connecter', registerBtn: 'Créer le compte',
      or: 'ou', demoTitle: 'Découvrir sans compte',
      demoBtn: 'Entrer avec le compte démo', demoRole: 'Administrateur — accès complet',
      emailOrUser: 'E-mail ou nom d’utilisateur',
      adminExistsNote: 'Un administrateur existe déjà — connectez-vous.',
      demoMode: 'Mode démonstration',
      dashboard: 'Tableau de bord', clients: 'Clients', reports: 'Rapports',
      settings: 'Paramètres', logout: 'Déconnexion', admin: 'Administrateur',
      dashTitle: 'Tableau de bord', dashSub: 'Vue d’ensemble de votre activité',
      totalClients: 'Total clients', totalDebts: 'Total des dettes',
      totalPayments: 'Total des paiements', totalRemaining: 'Reste à encaisser',
      registeredClients: 'clients enregistrés', amountSold: 'montant total vendu',
      amountCollected: 'montant encaissé', stillOwed: 'encore dû',
      recentClients: 'Clients récents', recentPayments: 'Paiements récents',
      noRecentPayments: 'Aucun paiement pour le moment',
      clientsTitle: 'Clients', clientsSub: 'Gérez vos clients et leurs dettes',
      filterAll: 'Tous', filterPaid: 'Payé', filterDebt: 'Dette',
      filterAllTime: 'Tout le temps', filterToday: "Aujourd'hui",
      filterMonth: 'Dernier mois', filterYear: 'Dernière année',
      newClient: 'Nouveau client', searchClients: 'Rechercher par nom ou téléphone...',
      purchases: 'Achats', total: 'Total', paid: 'Payé', rest: 'Reste',
      fullyPaid: 'Soldé', products: 'Produits',
      view: 'Détails', edit: 'Modifier', delete: 'Supprimer',
      payment: 'Paiement', history: 'Historique',
      noClients: 'Aucun client pour l’instant',
      noClientsSub: 'Commencez par ajouter votre premier client pour suivre ses achats et ses paiements.',
      noResults: 'Aucun résultat', noResultsSub: 'Aucun client ne correspond à votre recherche.',
      addFirstClient: 'Ajouter un client',
      newClientTitle: 'Nouveau client', editClientTitle: 'Modifier le client',
      newClientSub: 'Renseignez les informations et les produits',
      clientInfo: 'Informations du client', phone: 'Téléphone', address: 'Adresse',
      phonePh: 'Ex : 06 12 34 56 78', addressPh: 'Ex : Rue Didouche Mourad, Alger',
      namePh: 'Ex : Ahmed Benali',
      productsSold: 'Produits / articles vendus', productName: 'Article', productDesc: 'Description',
      price: 'Prix', addProduct: 'Ajouter un article',
      productNamePh: 'Ex : Réfrigérateur', productDescPh: 'Ex : Modèle 300L, blanc',
      initialPayment: 'Acompte initial (déjà payé)', amountPaidNow: 'Montant payé maintenant',
      totalAmount: 'Total à payer', remaining: 'Reste à payer',
      create: 'Créer le client', save: 'Enregistrer', cancel: 'Annuler',
      detailsTitle: 'Détails du client', memberSince: 'Client depuis',
      description: 'Description', paymentSummary: 'Résumé financier',
      latestPayments: 'Derniers paiements', noProducts: 'Aucun produit',
      makePayment: 'Enregistrer un paiement', paymentFor: 'Paiement pour',
      currentTotal: 'Total', alreadyPaid: 'Déjà payé', currentRest: 'Reste actuel',
      payNow: 'Montant à payer maintenant', newRest: 'Nouveau reste',
      savePayment: 'Enregistrer le paiement', payFull: 'Tout solder',
      historyTitle: 'Historique des paiements', historyFor: 'Historique de',
      initialPaymentLabel: 'Acompte initial', paymentLabel: 'Paiement',
      noPayments: 'Aucun paiement enregistré', totalPaidLabel: 'Total payé',
      reportsTitle: 'Rapports', reportsSub: 'Générez un rapport sur une période',
      startDate: 'Date de début', endDate: 'Date de fin', generate: 'Générer le rapport',
      reportPeriod: 'Période du rapport', allTime: 'Toutes les dates',
      totalSales: 'Ventes totales', totalCollected: 'Total encaissé',
      totalOutstanding: 'Total restant', clientsBreakdown: 'Détail par client',
      paymentsInPeriod: 'Paiements sur la période', client: 'Client', date: 'Date', time: 'Heure',
      amount: 'Montant', type: 'Type', noPaymentsPeriod: 'Aucun paiement sur cette période',
      generateHint: 'Choisissez une période puis générez le rapport pour voir les détails.',
      selectPeriod: 'Sélectionnez une période',
      settingsTitle: 'Paramètres', settingsSub: 'Gérez votre profil et vos identifiants',
      personalInfo: 'Informations personnelles', loginInfo: 'Identifiants de connexion',
      newPassword: 'Nouveau mot de passe (laisser vide pour ne pas changer)',
      saveChanges: 'Enregistrer les modifications', changePassword: 'Changer le mot de passe',
      confirmDelete: 'Supprimer le client ?', confirmDeleteSub: 'Cette action est irréversible.',
      deleteMsg: 'Voulez-vous vraiment supprimer', deleteWarn: 'Toutes ses données et son historique de paiements seront perdus.',
      yesDelete: 'Oui, supprimer', keepIt: 'Annuler',
      clientCreated: 'Client créé avec succès', clientUpdated: 'Client mis à jour',
      clientDeleted: 'Client supprimé', paymentSaved: 'Paiement enregistré',
      settingsSaved: 'Paramètres enregistrés', accountCreated: 'Compte créé, bienvenue !',
      loggedOut: 'Vous êtes déconnecté', loading: 'Chargement...',
      checkEmail: 'Compte créé. Vérifiez votre e-mail pour confirmer la connexion.',
      errRequired: 'Veuillez remplir tous les champs obligatoires',
      errName: 'Le nom complet est requis', errPhone: 'Le téléphone est requis',
      errProducts: 'Ajoutez au moins un article avec un prix',
      errPassMatch: 'Les mots de passe ne correspondent pas',
      errPassLen: 'Le mot de passe doit contenir au moins 6 caractères',
      errUserExists: 'Cet e-mail ou nom d’utilisateur existe déjà',
      errLogin: 'Identifiants incorrects', errAmount: 'Saisissez un montant valide',
      errAmountMax: 'Le montant dépasse le reste à payer', errEmail: 'Adresse e-mail invalide',
      errConfig: 'Connexion à Supabase non configurée', errServer: 'Erreur serveur, réessayez',
      pieces: 'article(s)', at: 'à',
    },
    ar: {
      appName: 'إدارة الديون', tagline: 'إدارة الديون والعملاء',
      welcome: 'مرحباً بك', signInSub: 'سجّل الدخول لإدارة متجرك',
      createAccountSub: 'أنشئ حساب المسؤول الخاص بك',
      login: 'تسجيل الدخول', register: 'إنشاء حساب',
      fullName: 'الاسم الكامل', username: 'اسم المستخدم', email: 'البريد الإلكتروني',
      password: 'كلمة المرور', confirmPassword: 'تأكيد كلمة المرور',
      loginBtn: 'دخول', registerBtn: 'إنشاء الحساب',
      or: 'أو', demoTitle: 'جرّب بدون حساب',
      demoBtn: 'الدخول بالحساب التجريبي', demoRole: 'مسؤول — صلاحية كاملة',
      emailOrUser: 'البريد الإلكتروني أو اسم المستخدم',
      adminExistsNote: 'يوجد مسؤول بالفعل — سجّل الدخول.',
      demoMode: 'الوضع التجريبي',
      dashboard: 'لوحة التحكم', clients: 'العملاء', reports: 'التقارير',
      settings: 'الإعدادات', logout: 'تسجيل الخروج', admin: 'مسؤول',
      dashTitle: 'لوحة التحكم', dashSub: 'نظرة عامة على نشاطك',
      totalClients: 'إجمالي العملاء', totalDebts: 'إجمالي الديون',
      totalPayments: 'إجمالي المدفوعات', totalRemaining: 'المتبقي للتحصيل',
      registeredClients: 'عميل مسجّل', amountSold: 'إجمالي المبيعات',
      amountCollected: 'المبلغ المحصّل', stillOwed: 'المتبقي',
      recentClients: 'أحدث العملاء', recentPayments: 'أحدث المدفوعات',
      noRecentPayments: 'لا توجد مدفوعات بعد',
      clientsTitle: 'العملاء', clientsSub: 'إدارة العملاء وديونهم',
      filterAll: 'الكل', filterPaid: 'مسدّد', filterDebt: 'عليه دين',
      filterAllTime: 'كل الأوقات', filterToday: 'اليوم',
      filterMonth: 'الشهر الماضي', filterYear: 'السنة الماضية',
      newClient: 'عميل جديد', searchClients: 'ابحث بالاسم أو رقم الهاتف...',
      purchases: 'المشتريات', total: 'الإجمالي', paid: 'المدفوع', rest: 'المتبقي',
      fullyPaid: 'مسدّد', products: 'المنتجات',
      view: 'التفاصيل', edit: 'تعديل', delete: 'حذف', payment: 'دفع', history: 'السجل',
      noClients: 'لا يوجد عملاء بعد',
      noClientsSub: 'ابدأ بإضافة أول عميل لتتبّع مشترياته ومدفوعاته.',
      noResults: 'لا توجد نتائج', noResultsSub: 'لا يوجد عميل مطابق لبحثك.',
      addFirstClient: 'إضافة عميل',
      newClientTitle: 'عميل جديد', editClientTitle: 'تعديل العميل',
      newClientSub: 'أدخل المعلومات والمنتجات',
      clientInfo: 'معلومات العميل', phone: 'الهاتف', address: 'العنوان',
      phonePh: 'مثال: 06 12 34 56 78', addressPh: 'مثال: شارع ديدوش مراد، الجزائر',
      namePh: 'مثال: أحمد بنعلي',
      productsSold: 'المنتجات / السلع المباعة', productName: 'المنتج', productDesc: 'الوصف',
      price: 'السعر', addProduct: 'إضافة منتج',
      productNamePh: 'مثال: ثلاجة', productDescPh: 'مثال: موديل 300 لتر، أبيض',
      initialPayment: 'الدفعة الأولى (مدفوعة مسبقاً)', amountPaidNow: 'المبلغ المدفوع الآن',
      totalAmount: 'الإجمالي المستحق', remaining: 'المتبقي للدفع',
      create: 'إنشاء العميل', save: 'حفظ', cancel: 'إلغاء',
      detailsTitle: 'تفاصيل العميل', memberSince: 'عميل منذ',
      description: 'الوصف', paymentSummary: 'الملخص المالي',
      latestPayments: 'آخر المدفوعات', noProducts: 'لا توجد منتجات',
      makePayment: 'تسجيل دفعة', paymentFor: 'دفعة لـ',
      currentTotal: 'الإجمالي', alreadyPaid: 'المدفوع سابقاً', currentRest: 'المتبقي الحالي',
      payNow: 'المبلغ المدفوع الآن', newRest: 'المتبقي الجديد',
      savePayment: 'حفظ الدفعة', payFull: 'تسديد الكل',
      historyTitle: 'سجل المدفوعات', historyFor: 'سجل',
      initialPaymentLabel: 'الدفعة الأولى', paymentLabel: 'دفعة',
      noPayments: 'لا توجد مدفوعات مسجّلة', totalPaidLabel: 'إجمالي المدفوع',
      reportsTitle: 'التقارير', reportsSub: 'أنشئ تقريراً لفترة زمنية',
      startDate: 'تاريخ البداية', endDate: 'تاريخ النهاية', generate: 'إنشاء التقرير',
      reportPeriod: 'فترة التقرير', allTime: 'كل الفترات',
      totalSales: 'إجمالي المبيعات', totalCollected: 'إجمالي المحصّل',
      totalOutstanding: 'إجمالي المتبقي', clientsBreakdown: 'التفصيل حسب العميل',
      paymentsInPeriod: 'المدفوعات خلال الفترة', client: 'العميل', date: 'التاريخ', time: 'الوقت',
      amount: 'المبلغ', type: 'النوع', noPaymentsPeriod: 'لا توجد مدفوعات في هذه الفترة',
      generateHint: 'اختر فترة زمنية ثم أنشئ التقرير لعرض التفاصيل.',
      selectPeriod: 'اختر فترة زمنية',
      settingsTitle: 'الإعدادات', settingsSub: 'إدارة ملفك الشخصي وبيانات الدخول',
      personalInfo: 'المعلومات الشخصية', loginInfo: 'بيانات تسجيل الدخول',
      newPassword: 'كلمة مرور جديدة (اتركها فارغة لعدم التغيير)',
      saveChanges: 'حفظ التغييرات', changePassword: 'تغيير كلمة المرور',
      confirmDelete: 'حذف العميل؟', confirmDeleteSub: 'هذا الإجراء لا يمكن التراجع عنه.',
      deleteMsg: 'هل تريد فعلاً حذف', deleteWarn: 'سيتم فقدان جميع بياناته وسجل مدفوعاته.',
      yesDelete: 'نعم، احذف', keepIt: 'إلغاء',
      clientCreated: 'تم إنشاء العميل بنجاح', clientUpdated: 'تم تحديث العميل',
      clientDeleted: 'تم حذف العميل', paymentSaved: 'تم تسجيل الدفعة',
      settingsSaved: 'تم حفظ الإعدادات', accountCreated: 'تم إنشاء الحساب، مرحباً بك!',
      loggedOut: 'تم تسجيل الخروج', loading: 'جارٍ التحميل...',
      checkEmail: 'تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتأكيد الدخول.',
      errRequired: 'يرجى ملء جميع الحقول المطلوبة',
      errName: 'الاسم الكامل مطلوب', errPhone: 'رقم الهاتف مطلوب',
      errProducts: 'أضف منتجاً واحداً على الأقل مع سعره',
      errPassMatch: 'كلمتا المرور غير متطابقتين',
      errPassLen: 'يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل',
      errUserExists: 'هذا البريد أو اسم المستخدم موجود بالفعل',
      errLogin: 'بيانات الدخول غير صحيحة', errAmount: 'أدخل مبلغاً صحيحاً',
      errAmountMax: 'المبلغ يتجاوز المتبقي للدفع', errEmail: 'البريد الإلكتروني غير صالح',
      errConfig: 'لم يتم إعداد الاتصال بـ Supabase', errServer: 'خطأ في الخادم، حاول مجدداً',
      pieces: 'منتج', at: 'الساعة',
    }
  };

  /* ---------------------------------------------------------
     2. ICONS
     --------------------------------------------------------- */
  const ic = {
    wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5"/><path d="M17 12h.01"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    report: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h2m-2 4h2m4-4h2m-2 4h2"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6M14 11v6"/></svg>',
    cash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m22 4-10 10.01-3-3"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8V16a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    coins: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4M16.71 13.88l.7.71-2.82 2.82"/></svg>',
  };

  /* ---------------------------------------------------------
     3. STATE
     --------------------------------------------------------- */
  const LANG_KEY = 'gestdette.lang';
  const state = {
    lang: localStorage.getItem(LANG_KEY) || 'fr',
    user: null,
    demo: false,
    clients: [],
    adminExists: null,
    view: 'dashboard',
    search: '',
    filterStatus: 'all',
    filterTime: 'all',
    authMode: 'login',
    sidebarOpen: false,
    busy: false,
  };

  /* ---------------------------------------------------------
     4. HELPERS
     --------------------------------------------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const uid = () => 'id' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
  function t(k) { return (I18N[state.lang] && I18N[state.lang][k]) || I18N.fr[k] || k; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }
  function money(n) {
    const v = Math.round(Number(n) || 0);
    const locale = state.lang === 'ar' ? 'ar-DZ' : 'fr-FR';
    return v.toLocaleString(locale) + ' ' + CURRENCY;
  }
  function fmtDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString(state.lang === 'ar' ? 'ar-DZ' : 'fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  function fmtDateTime(iso) {
    const d = new Date(iso);
    const locale = state.lang === 'ar' ? 'ar-DZ' : 'fr-FR';
    const date = d.toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' });
    const time = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    return `${date} ${t('at')} ${time}`;
  }
  function initials(name) {
    return String(name || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || '?';
  }
  function clientTotal(c) { return (c.products || []).reduce((s, p) => s + (Number(p.price) || 0), 0); }
  function clientPaid(c) { return (c.payments || []).reduce((s, p) => s + (Number(p.amount) || 0), 0); }
  function clientRest(c) { return Math.max(0, clientTotal(c) - clientPaid(c)); }
  function getClient(id) { return state.clients.find(c => c.id === id); }
  function getLocalDateAndTime(isoString) {
    const d = isoString ? new Date(isoString) : new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return {
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}`
    };
  }
  function sortClients() {
    state.clients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  /* ---------------------------------------------------------
     5. BACKENDS  (offline demo + Supabase) — same async API
     --------------------------------------------------------- */
  function seedClients() {
    const now = Date.now();
    const daysAgo = (d) => new Date(now - d * 86400000).toISOString();
    return [
      { id: uid(), fullName: 'Ahmed Benali', phone: '06 12 34 56 78', address: 'Rue Didouche Mourad, Alger', createdAt: daysAgo(40),
        products: [{ id: uid(), name: 'Réfrigérateur', description: 'Modèle 300L, blanc', price: 62000 }, { id: uid(), name: 'Micro-ondes', description: '25L inox', price: 18000 }],
        payments: [{ id: uid(), amount: 30000, type: 'initial', date: daysAgo(40) }, { id: uid(), amount: 15000, type: 'payment', date: daysAgo(20) }, { id: uid(), amount: 8000, type: 'payment', date: daysAgo(6) }] },
      { id: uid(), fullName: 'Fatima Zahra', phone: '05 55 44 33 22', address: 'Cité 5 Juillet, Oran', createdAt: daysAgo(28),
        products: [{ id: uid(), name: 'Machine à laver', description: '7kg, automatique', price: 55000 }],
        payments: [{ id: uid(), amount: 20000, type: 'initial', date: daysAgo(28) }, { id: uid(), amount: 15000, type: 'payment', date: daysAgo(10) }] },
      { id: uid(), fullName: 'Youssef El Amrani', phone: '07 88 99 00 11', address: 'Avenue de l’ALN, Constantine', createdAt: daysAgo(15),
        products: [{ id: uid(), name: 'Téléviseur 55"', description: 'Smart TV 4K', price: 78000 }, { id: uid(), name: 'Barre de son', description: 'Bluetooth 200W', price: 22000 }],
        payments: [{ id: uid(), amount: 100000, type: 'initial', date: daysAgo(15) }] },
      { id: uid(), fullName: 'Salma Bennani', phone: '06 21 43 65 87', address: 'Hydra, Alger', createdAt: daysAgo(9),
        products: [{ id: uid(), name: 'Canapé 3 places', description: 'Tissu gris', price: 68000 }],
        payments: [{ id: uid(), amount: 25000, type: 'initial', date: daysAgo(9) }, { id: uid(), amount: 12000, type: 'payment', date: daysAgo(3) }] },
      { id: uid(), fullName: 'Karim Tazi', phone: '07 12 78 34 56', address: 'Bab Ezzouar, Alger', createdAt: daysAgo(4),
        products: [{ id: uid(), name: 'Ordinateur portable', description: 'Core i5, 16Go RAM', price: 95000 }],
        payments: [{ id: uid(), amount: 40000, type: 'initial', date: daysAgo(4) }, { id: uid(), amount: 18000, type: 'payment', date: daysAgo(1) }] },
    ];
  }

  const Local = {
    async load() { if (!state.clients.length) state.clients = seedClients(); },
    async createClient(d) {
      const payments = d.initialPaid > 0 ? [{ id: uid(), amount: d.initialPaid, type: 'initial', date: d.createdAt }] : [];
      state.clients.unshift({ id: uid(), fullName: d.fullName, phone: d.phone, address: d.address,
        products: d.products.map(p => ({ ...p, id: uid() })), payments, createdAt: d.createdAt });
      sortClients();
    },
    async updateClient(id, d) {
      const c = getClient(id); if (!c) return;
      c.fullName = d.fullName; c.phone = d.phone; c.address = d.address;
      c.products = d.products.map(p => ({ ...p, id: p.id || uid() }));
      c.createdAt = d.createdAt;
      sortClients();
    },
    async deleteClient(id) { state.clients = state.clients.filter(c => c.id !== id); },
    async addPayment(id, amount, date) {
      const c = getClient(id); if (!c) return;
      c.payments = c.payments || [];
      c.payments.push({ id: uid(), amount, type: 'payment', date: date || new Date().toISOString() });
    },
    async updateProfile(p) { Object.assign(state.user, p); },
  };

  const Remote = {
    async load() {
      const s = getSb(); if (!s) throw new Error('config');
      const { data, error } = await s
        .from('clients')
        .select('id, full_name, phone, address, created_at, products(id,name,description,price), payments(id,amount,type,created_at)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      state.clients = (data || []).map(row => ({
        id: row.id, fullName: row.full_name, phone: row.phone, address: row.address, createdAt: row.created_at,
        products: (row.products || []).map(p => ({ id: p.id, name: p.name, description: p.description, price: Number(p.price) })),
        payments: (row.payments || []).map(p => ({ id: p.id, amount: Number(p.amount), type: p.type, date: p.created_at })),
      }));
    },
    async createClient(d) {
      const s = getSb();
      const { data: client, error } = await s.from('clients')
        .insert({ full_name: d.fullName, phone: d.phone, address: d.address, created_at: d.createdAt })
        .select('id, created_at')
        .single();
      if (error) throw error;
      
      let insertedProducts = [];
      if (d.products.length) {
        const { data: prods, error: pe } = await s.from('products')
          .insert(d.products.map(p => ({ client_id: client.id, name: p.name, description: p.description, price: p.price, created_at: d.createdAt })))
          .select('id, name, description, price');
        if (pe) throw pe;
        insertedProducts = (prods || []).map(p => ({ id: p.id, name: p.name, description: p.description, price: Number(p.price) }));
      }

      let insertedPayments = [];
      if (d.initialPaid > 0) {
        const { data: pay, error: pe2 } = await s.from('payments')
          .insert({ client_id: client.id, amount: d.initialPaid, type: 'initial', created_at: d.createdAt })
          .select('id, amount, type, created_at')
          .single();
        if (pe2) throw pe2;
        insertedPayments = [{ id: pay.id, amount: Number(pay.amount), type: pay.type, date: pay.created_at }];
      }

      const newClient = {
        id: client.id,
        fullName: d.fullName,
        phone: d.phone,
        address: d.address,
        createdAt: client.created_at,
        products: insertedProducts,
        payments: insertedPayments
      };
      state.clients.unshift(newClient);
      sortClients();
    },
    async updateClient(id, d) {
      const s = getSb();
      const { error } = await s.from('clients')
        .update({ full_name: d.fullName, phone: d.phone, address: d.address, created_at: d.createdAt })
        .eq('id', id);
      if (error) throw error;

      const { error: de } = await s.from('products').delete().eq('client_id', id);
      if (de) throw de;

      let insertedProducts = [];
      if (d.products.length) {
        const { data: prods, error: pe } = await s.from('products')
          .insert(d.products.map(p => ({ client_id: id, name: p.name, description: p.description, price: p.price, created_at: d.createdAt })))
          .select('id, name, description, price');
        if (pe) throw pe;
        insertedProducts = (prods || []).map(p => ({ id: p.id, name: p.name, description: p.description, price: Number(p.price) }));
      }

      const c = getClient(id);
      if (c) {
        c.fullName = d.fullName;
        c.phone = d.phone;
        c.address = d.address;
        c.createdAt = d.createdAt;
        c.products = insertedProducts;
      }
      sortClients();
    },
    async deleteClient(id) {
      const s = getSb();
      const { error } = await s.from('clients').delete().eq('id', id);
      if (error) throw error;
      state.clients = state.clients.filter(c => c.id !== id);
    },
    async addPayment(id, amount, date) {
      const s = getSb();
      const payload = { client_id: id, amount, type: 'payment' };
      if (date) payload.created_at = date;
      const { data: pay, error } = await s.from('payments')
        .insert(payload)
        .select('id, amount, type, created_at')
        .single();
      if (error) throw error;

      const c = getClient(id);
      if (c) {
        c.payments = c.payments || [];
        c.payments.push({
          id: pay.id,
          amount: Number(pay.amount),
          type: pay.type,
          date: pay.created_at
        });
      }
    },
    async updateProfile(p) {
      const s = getSb();
      const prof = {};
      if (p.fullName !== undefined) prof.full_name = p.fullName;
      if (p.username !== undefined) prof.username = p.username;
      if (p.email !== undefined) prof.email = p.email;
      if (Object.keys(prof).length) {
        const { error } = await s.from('profiles').update(prof).eq('id', state.user.id);
        if (error) throw error;
      }
      const authPatch = {};
      if (p.email) authPatch.email = p.email;
      if (p.password) authPatch.password = p.password;
      if (Object.keys(authPatch).length) { await s.auth.updateUser(authPatch); }
      Object.assign(state.user, p);
      delete state.user.password;
    },
  };

  function backend() { return state.demo ? Local : Remote; }

  /* ---------------------------------------------------------
     6. RENDER ROOT
     --------------------------------------------------------- */
  const appEl = () => document.getElementById('app');
  function applyLangAttrs() {
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
  }
  function render() {
    applyLangAttrs();
    if (!state.user) renderAuth();
    else renderShell();
  }
  function setLang(lang) { state.lang = lang; localStorage.setItem(LANG_KEY, lang); render(); }

  function showLoader(msg) {
    let el = document.getElementById('app-loader');
    if (!el) {
      el = document.createElement('div');
      el.id = 'app-loader'; el.className = 'app-loader';
      document.body.appendChild(el);
    }
    el.innerHTML = `<div class="loader-card"><div class="spinner"></div><span>${esc(msg || t('loading'))}</span></div>`;
    el.classList.add('show');
  }
  function hideLoader() { const el = document.getElementById('app-loader'); if (el) el.classList.remove('show'); }

  /* ---------------------------------------------------------
     7. AUTH
     --------------------------------------------------------- */
  function langSwitchHTML() {
    return `<div class="lang-switch">
      <button data-lang="fr" class="${state.lang === 'fr' ? 'active' : ''}">FR</button>
      <button data-lang="ar" class="${state.lang === 'ar' ? 'active' : ''}">ع</button>
    </div>`;
  }

  function renderAuth() {
    const canRegister = state.adminExists === false;   // only before first admin
    const isLogin = state.authMode === 'login' || !canRegister;
    appEl().innerHTML = `
      <div class="auth-wrap">
        <div class="auth-card">
          ${langSwitchHTML()}
          <div class="brand-logo">${ic.wallet}</div>
          <div class="auth-title">${esc(t('appName'))}</div>
          <div class="auth-sub">${esc(isLogin ? t('signInSub') : t('createAccountSub'))}</div>

          ${canRegister ? `
          <div class="auth-tabs">
            <div class="tab-glider" style="transform: translateX(${isLogin ? '0' : '100%'})"></div>
            <button data-mode="login" class="${isLogin ? 'active' : ''}">${esc(t('login'))}</button>
            <button data-mode="register" class="${!isLogin ? 'active' : ''}">${esc(t('register'))}</button>
          </div>` : (state.adminExists === true ? `<div class="admin-note">${ic.lock}<span>${esc(t('adminExistsNote'))}</span></div>` : '')}

          <div id="auth-err"></div>
          <form id="auth-form" autocomplete="off">
            ${isLogin ? loginFields() : registerFields()}
            <button type="submit" class="btn block lg" id="auth-submit" style="margin-top:6px">
              ${ic.check}<span>${esc(isLogin ? t('loginBtn') : t('registerBtn'))}</span>
            </button>
          </form>


        </div>
      </div>`;
    bindAuth();
  }

  function loginFields() {
    return `
      <div class="field"><label>${esc(t('emailOrUser'))}</label>
        <input class="input" name="identifier" placeholder="admin@boutique.com" /></div>
      <div class="field"><label>${esc(t('password'))}</label>
        <input class="input" name="password" type="password" placeholder="••••••••" /></div>`;
  }
  function registerFields() {
    return `
      <div class="field"><label>${esc(t('fullName'))}</label>
        <input class="input" name="fullName" placeholder="${esc(t('namePh'))}" /></div>
      <div class="field"><label>${esc(t('username'))}</label>
        <input class="input" name="username" placeholder="admin" /></div>
      <div class="field"><label>${esc(t('email'))}</label>
        <input class="input" name="email" type="email" placeholder="admin@boutique.com" /></div>
      <div class="grid-2">
        <div class="field"><label>${esc(t('password'))}</label>
          <input class="input" name="password" type="password" placeholder="••••••••" /></div>
        <div class="field"><label>${esc(t('confirmPassword'))}</label>
          <input class="input" name="confirm" type="password" placeholder="••••••••" /></div>
      </div>`;
  }
  function authError(msg) { const b = $('#auth-err'); if (b) b.innerHTML = `<div class="form-err">${esc(msg)}</div>`; }
  function setSubmitting(on, labelKey) {
    const btn = $('#auth-submit'); if (!btn) return;
    btn.disabled = on;
    btn.innerHTML = on ? `<span class="spinner sm"></span><span>${esc(t('loading'))}</span>`
      : `${ic.check}<span>${esc(t(labelKey))}</span>`;
  }

  function bindAuth() {
    document.querySelectorAll('.lang-switch button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
    document.querySelectorAll('.auth-tabs button').forEach(b => b.addEventListener('click', () => { state.authMode = b.dataset.mode; renderAuth(); }));
    const demoBtn = $('#demo-btn');
    if (demoBtn) demoBtn.addEventListener('click', enterDemo);
    $('#auth-form').addEventListener('submit', onAuthSubmit);
  }

  async function onAuthSubmit(e) {
    e.preventDefault();
    const f = e.target;
    const isLogin = state.authMode === 'login' || state.adminExists !== false;
    const s = getSb();
    if (!s) return authError(t('errConfig'));

    if (isLogin) {
      const id = f.identifier.value.trim();
      const pass = f.password.value;
      if (!id || !pass) return authError(t('errRequired'));
      setSubmitting(true, 'loginBtn');
      try {
        let email = id;
        if (!id.includes('@')) {
          const { data: em } = await s.rpc('get_email_by_username', { p_username: id });
          if (em) email = em;
        }
        const { data, error } = await s.auth.signInWithPassword({ email: email.toLowerCase(), password: pass });
        if (error) { setSubmitting(false, 'loginBtn'); return authError(t('errLogin')); }
        await enterApp(data.session);
      } catch (err) { setSubmitting(false, 'loginBtn'); authError(t('errServer')); }
    } else {
      const fullName = f.fullName.value.trim(), username = f.username.value.trim();
      const email = f.email.value.trim(), pass = f.password.value, confirm = f.confirm.value;
      if (!fullName || !username || !email || !pass) return authError(t('errRequired'));
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return authError(t('errEmail'));
      if (pass.length < 6) return authError(t('errPassLen'));
      if (pass !== confirm) return authError(t('errPassMatch'));
      setSubmitting(true, 'registerBtn');
      try {
        const { data, error } = await s.auth.signUp({
          email: email.toLowerCase(), password: pass,
          options: { data: { full_name: fullName, username } },
        });
        if (error) { setSubmitting(false, 'registerBtn'); return authError(/already/i.test(error.message) ? t('errUserExists') : error.message); }
        state.adminExists = true;               // hide the register button from now on
        if (data.session) { await enterApp(data.session, t('accountCreated')); }
        else { state.authMode = 'login'; renderAuth(); toast(t('checkEmail'), 'info'); }
      } catch (err) { setSubmitting(false, 'registerBtn'); authError(t('errServer')); }
    }
  }

  async function enterApp(session, welcomeMsg) {
    showLoader();
    state.demo = false;
    const s = getSb();
    let profile = null;
    try {
      const { data } = await s.from('profiles').select('*').eq('id', session.user.id).single();
      profile = data;
    } catch (e) {}
    const meta = session.user.user_metadata || {};
    state.user = {
      id: session.user.id,
      fullName: (profile && profile.full_name) || meta.full_name || (session.user.email || '').split('@')[0],
      username: (profile && profile.username) || meta.username || '',
      email: session.user.email,
      role: (profile && profile.role) || 'admin',
    };
    state.view = 'dashboard';
    try { await Remote.load(); } catch (e) { state.clients = []; }
    hideLoader();
    render();
    setTimeout(() => toast(welcomeMsg || `${t('welcome')}, ${state.user.fullName.split(' ')[0]} 👋`, 'success'), 150);
  }

  function enterDemo() {
    state.demo = true;
    state.user = { id: 'demo', fullName: 'Compte Démo', username: 'demo', email: 'demo@gestdette.app', role: 'admin' };
    state.view = 'dashboard';
    state.clients = [];
    Local.load().then(() => { render(); setTimeout(() => toast(`${t('welcome')} 👋 · ${t('demoMode')}`, 'info'), 150); });
  }

  async function logout() {
    if (!state.demo) { const s = getSb(); if (s) { try { await s.auth.signOut(); } catch (e) {} } }
    state.demo = false; state.user = null; state.clients = [];
    state.authMode = 'login';
    await refreshAdminExists();
    render();
    toast(t('loggedOut'), 'info');
  }

  async function refreshAdminExists() {
    const s = getSb();
    if (!s) { state.adminExists = false; return; }
    try { const { data, error } = await s.rpc('admin_exists'); state.adminExists = error ? false : !!data; }
    catch (e) { state.adminExists = false; }
  }

  /* ---------------------------------------------------------
     8. APP SHELL
     --------------------------------------------------------- */
  const NAV = [
    { id: 'dashboard', icon: 'grid', label: 'dashboard' },
    { id: 'clients', icon: 'users', label: 'clients' },
    { id: 'reports', icon: 'report', label: 'reports' },
    { id: 'settings', icon: 'gear', label: 'settings' },
  ];
  const VIEW_META = {
    dashboard: { title: 'dashTitle', sub: 'dashSub' },
    clients: { title: 'clientsTitle', sub: 'clientsSub' },
    reports: { title: 'reportsTitle', sub: 'reportsSub' },
    settings: { title: 'settingsTitle', sub: 'settingsSub' },
  };

  function renderShell() {
    const u = state.user;
    appEl().innerHTML = `
      <div class="app-shell">
        <div class="sidebar-backdrop ${state.sidebarOpen ? 'show' : ''}" id="sb-backdrop"></div>
        <aside class="sidebar ${state.sidebarOpen ? 'open' : ''}">
          <div class="sidebar-brand">
            <div class="logo-mini">${ic.wallet}</div>
            <div><h1>${esc(t('appName'))}</h1><span>${esc(t('tagline'))}</span></div>
          </div>
          <nav class="nav">
            ${NAV.map((n, i) => `
              <a class="nav-item ${state.view === n.id ? 'active' : ''}" data-nav="${n.id}" style="--i:${i}">
                ${ic[n.icon]}<span>${esc(t(n.label))}</span>
              </a>`).join('')}
          </nav>
          <div class="sidebar-user">
            <div class="avatar">${esc(initials(u.fullName))}</div>
            <div style="min-width:0">
              <div class="u-name">${esc(u.fullName)}</div>
              <div class="u-role">${state.demo ? esc(t('demoMode')) : esc(t('admin'))}</div>
            </div>
          </div>
          <button class="logout-btn" id="logout-btn">${ic.logout}<span>${esc(t('logout'))}</span></button>
        </aside>

        <main class="main">
          <header class="topbar">
            <div class="topbar-left">
              <button class="menu-toggle" id="menu-toggle">${ic.menu}</button>
              <div class="page-title" id="page-title"></div>
            </div>
            <div class="topbar-actions">
              ${state.demo ? `<span class="demo-pill">${ic.eye}${esc(t('demoMode'))}</span>` : ''}
              ${langSwitchHTML()}
            </div>
          </header>
          <div class="content"><div id="view-content"></div></div>
        </main>

        <nav class="bottom-nav">
          ${NAV.map(n => `<a class="bn-item ${state.view === n.id ? 'active' : ''}" data-nav="${n.id}">${ic[n.icon]}<span>${esc(t(n.label))}</span></a>`).join('')}
        </nav>
      </div>`;

    document.querySelectorAll('[data-nav]').forEach(el => el.addEventListener('click', () => navigate(el.dataset.nav)));
    $('#logout-btn').addEventListener('click', logout);
    document.querySelectorAll('.topbar .lang-switch button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
    $('#menu-toggle').addEventListener('click', () => { state.sidebarOpen = true; $('.sidebar').classList.add('open'); $('#sb-backdrop').classList.add('show'); });
    $('#sb-backdrop').addEventListener('click', closeSidebar);
    renderView();
  }

  function closeSidebar() {
    state.sidebarOpen = false;
    const sb2 = $('.sidebar'); if (sb2) sb2.classList.remove('open');
    const bd = $('#sb-backdrop'); if (bd) bd.classList.remove('show');
  }

  function navigate(view) {
    if (view === state.view) { closeSidebar(); return; }
    state.view = view;
    document.querySelectorAll('[data-nav]').forEach(n => n.classList.toggle('active', n.dataset.nav === view));
    closeSidebar();
    const c = $('#view-content');
    if (c) {
      c.classList.add('view-leaving');
      setTimeout(() => { c.classList.remove('view-leaving'); renderView(); }, 200);
    } else renderView();
  }

  function renderView() {
    const meta = VIEW_META[state.view];
    $('#page-title').innerHTML = `<h2>${esc(t(meta.title))}</h2><p>${esc(t(meta.sub))}</p>`;
    const c = $('#view-content');
    if (state.view === 'dashboard') { c.innerHTML = viewDashboard(); animateCounters(); }
    else if (state.view === 'clients') { c.innerHTML = viewClients(); bindClients(); }
    else if (state.view === 'reports') { c.innerHTML = viewReports(); bindReports(); }
    else if (state.view === 'settings') { c.innerHTML = viewSettings(); bindSettings(); }
    const content = $('.content'); if (content) content.scrollTop = 0;
  }

  function rerenderCurrentView() {
    const c = $('#view-content'); if (!c) return;
    if (state.view === 'clients') { c.innerHTML = viewClients(); bindClients(); }
    else if (state.view === 'dashboard') { c.innerHTML = viewDashboard(); animateCounters(); }
    else if (state.view === 'reports' && state._rpGenerated) { const r = $('#rp-results'); if (r) r.innerHTML = reportResults(); }
  }

  /* ---------------------------------------------------------
     9. DASHBOARD
     --------------------------------------------------------- */
  function viewDashboard() {
    const clients = state.clients;
    const totalDebt = clients.reduce((s, c) => s + clientTotal(c), 0);
    const totalPaid = clients.reduce((s, c) => s + clientPaid(c), 0);
    const totalRest = clients.reduce((s, c) => s + clientRest(c), 0);
    const allPayments = [];
    clients.forEach(c => (c.payments || []).forEach(p => allPayments.push({ client: c, ...p })));
    allPayments.sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentPay = allPayments.slice(0, 5);
    const recentClients = [...clients].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    const statCard = (cls, icon, label, value, foot, isMoney) => `
      <div class="stat-card ${cls}">
        <div class="stat-icon">${ic[icon]}</div>
        <div class="stat-label">${esc(label)}</div>
        <div class="stat-value" data-count="${value}" data-money="${isMoney ? 1 : 0}">0</div>
        <div class="stat-foot">${ic.trend} ${esc(foot)}</div>
      </div>`;

    return `<div class="view">
      <div class="stat-grid">
        ${statCard('c-clients', 'users', t('totalClients'), clients.length, `${clients.length} ${t('registeredClients')}`, false)}
        ${statCard('c-debt', 'coins', t('totalDebts'), totalDebt, t('amountSold'), true)}
        ${statCard('c-pay', 'cash', t('totalPayments'), totalPaid, t('amountCollected'), true)}
        ${statCard('c-out', 'wallet', t('totalRemaining'), totalRest, t('stillOwed'), true)}
      </div>
      <div class="dash-2col">
        <div>
          <div class="section-title"><span class="bar"></span>${esc(t('recentClients'))}</div>
          <div class="panel">
            ${recentClients.length ? recentClients.map(c => `
              <div class="list-row" data-open-client="${c.id}" style="cursor:pointer">
                <div class="avatar sm">${esc(initials(c.fullName))}</div>
                <div class="lr-main"><div class="lr-name">${esc(c.fullName)}</div><div class="lr-sub">${esc(c.phone || '')}</div></div>
                <div style="text-align:end"><div class="lr-amount" style="color:var(--c-warning)">${money(clientRest(c))}</div><div class="lr-sub">${esc(t('rest'))}</div></div>
              </div>`).join('') : emptyMini(t('noClients'))}
          </div>
        </div>
        <div>
          <div class="section-title"><span class="bar"></span>${esc(t('recentPayments'))}</div>
          <div class="panel">
            ${recentPay.length ? recentPay.map(p => `
              <div class="list-row">
                <div class="mini-icon" style="width:38px;height:38px;background:${p.type === 'initial' ? 'var(--g-violet)' : 'var(--g-money)'}">${ic.cash}</div>
                <div class="lr-main"><div class="lr-name">${esc(p.client.fullName)}</div><div class="lr-sub">${esc(fmtDate(p.date))}</div></div>
                <div class="lr-amount" style="color:var(--c-success)">+${money(p.amount)}</div>
              </div>`).join('') : emptyMini(t('noRecentPayments'))}
          </div>
        </div>
      </div>
    </div>`;
  }
  function emptyMini(msg) { return `<div style="padding:34px 16px;text-align:center;color:var(--ink-3);font-size:14px">${esc(msg)}</div>`; }

  function animateCounters() {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const locale = state.lang === 'ar' ? 'ar-DZ' : 'fr-FR';
    document.querySelectorAll('.stat-value').forEach(el => {
      const target = Number(el.dataset.count) || 0;
      const isMoney = el.dataset.money === '1';
      const final = isMoney ? money(target) : target.toLocaleString(locale);
      if (reduce) { el.textContent = final; return; }
      const dur = 900, start = performance.now();
      let done = false;
      function step(now) {
        const prog = Math.min(1, (now - start) / dur);
        const val = target * (1 - Math.pow(1 - prog, 3));
        el.textContent = isMoney ? money(val) : Math.round(val).toLocaleString(locale);
        if (prog < 1) requestAnimationFrame(step);
        else { el.textContent = final; done = true; }
      }
      requestAnimationFrame(step);
      // Fallback: guarantee the final value even if rAF never fires
      // (background tab, non-painting/headless context, etc.)
      setTimeout(() => { if (!done) el.textContent = final; }, dur + 150);
    });
  }

  /* ---------------------------------------------------------
     10. CLIENTS
     --------------------------------------------------------- */
  function getFilteredClients() {
    const clients = state.clients;
    
    // 1. Search filter
    const q = state.search.trim().toLowerCase();
    const qDigits = q.replace(/\D/g, '');
    let filtered = q ? clients.filter(c => {
      const name = c.fullName.toLowerCase(), phone = (c.phone || '').toLowerCase();
      return name.includes(q) || phone.includes(q) || (qDigits && phone.replace(/\D/g, '').includes(qDigits));
    }) : clients;

    // 2. Status filter
    if (state.filterStatus === 'paid') {
      filtered = filtered.filter(c => {
        const total = clientTotal(c), rest = clientRest(c);
        return rest <= 0 && total > 0;
      });
    } else if (state.filterStatus === 'debt') {
      filtered = filtered.filter(c => clientRest(c) > 0);
    }

    // 3. Time filter
    if (state.filterTime === 'today') {
      const todayStr = new Date().toDateString();
      filtered = filtered.filter(c => new Date(c.createdAt).toDateString() === todayStr);
    } else if (state.filterTime === 'month') {
      const limit = 30 * 24 * 60 * 60 * 1000;
      const now = Date.now();
      filtered = filtered.filter(c => now - new Date(c.createdAt).getTime() <= limit);
    } else if (state.filterTime === 'year') {
      const limit = 365 * 24 * 60 * 60 * 1000;
      const now = Date.now();
      filtered = filtered.filter(c => now - new Date(c.createdAt).getTime() <= limit);
    }

    return filtered;
  }

  function renderClientsSummary(filteredClients) {
    let totalC = filteredClients.length;
    let totalP = 0;
    let totalR = 0;
    
    filteredClients.forEach(c => {
      totalP += clientPaid(c);
      totalR += clientRest(c);
    });

    return `
      <div class="stat-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 22px;">
        <div class="stat-card" style="padding: 16px; min-height: auto;">
          <div class="stat-label" style="font-size: 12px;">${esc(t('totalClients'))}</div>
          <div class="stat-value" style="font-size: 22px; margin-top: 2px;">${totalC}</div>
        </div>
        <div class="stat-card c-pay" style="padding: 16px; min-height: auto;">
          <div class="stat-label" style="font-size: 12px;">${esc(t('totalPayments'))}</div>
          <div class="stat-value" style="font-size: 22px; margin-top: 2px;">${money(totalP)}</div>
        </div>
        <div class="stat-card c-debt" style="padding: 16px; min-height: auto;">
          <div class="stat-label" style="font-size: 12px;">${esc(t('totalRemaining'))}</div>
          <div class="stat-value" style="font-size: 22px; margin-top: 2px;">${money(totalR)}</div>
        </div>
      </div>
    `;
  }

  function viewClients() {
    const filtered = getFilteredClients();

    return `<div class="view">
      <div class="toolbar" style="gap: 12px; margin-bottom: 20px; flex-wrap: wrap;">
        <div class="search-box" style="flex: 2; min-width: 200px; margin: 0;">${ic.search}
          <input id="client-search" placeholder="${esc(t('searchClients'))}" value="${esc(state.search)}" /></div>
        
        <div class="filter-group" style="display: flex; gap: 6px; background: var(--surface-2); padding: 4px; border-radius: 12px; border: 1px solid var(--line);">
          <button class="filter-status-btn btn sm ${state.filterStatus === 'all' ? '' : 'ghost'}" data-status="all" style="border: none; box-shadow: none; padding: 6px 12px; height: auto;">${esc(t('filterAll'))}</button>
          <button class="filter-status-btn btn sm ${state.filterStatus === 'paid' ? 'money' : 'ghost'}" data-status="paid" style="border: none; box-shadow: none; padding: 6px 12px; height: auto;">${esc(t('filterPaid'))}</button>
          <button class="filter-status-btn btn sm ${state.filterStatus === 'debt' ? 'danger' : 'ghost'}" data-status="debt" style="border: none; box-shadow: none; padding: 6px 12px; height: auto;">${esc(t('filterDebt'))}</button>
        </div>

        <div class="filter-group" style="display: flex; gap: 6px; background: var(--surface-2); padding: 4px; border-radius: 12px; border: 1px solid var(--line);">
          <button class="filter-time-btn btn sm ${state.filterTime === 'all' ? '' : 'ghost'}" data-time="all" style="border: none; box-shadow: none; padding: 6px 12px; height: auto;">${esc(t('filterAllTime'))}</button>
          <button class="filter-time-btn btn sm ${state.filterTime === 'today' ? 'violet' : 'ghost'}" data-time="today" style="border: none; box-shadow: none; padding: 6px 12px; height: auto;">${esc(t('filterToday'))}</button>
          <button class="filter-time-btn btn sm ${state.filterTime === 'month' ? 'violet' : 'ghost'}" data-time="month" style="border: none; box-shadow: none; padding: 6px 12px; height: auto;">${esc(t('filterMonth'))}</button>
          <button class="filter-time-btn btn sm ${state.filterTime === 'year' ? 'violet' : 'ghost'}" data-time="year" style="border: none; box-shadow: none; padding: 6px 12px; height: auto;">${esc(t('filterYear'))}</button>
        </div>

        <button class="btn" id="add-client-btn">${ic.plus}<span>${esc(t('newClient'))}</span></button>
      </div>
      <div id="clients-list-container">
        ${renderClientsGridContent(filtered, state.clients.length)}
      </div>
    </div>`;
  }

  function renderClientsGridContent(filtered, totalCount) {
    const summaryHtml = renderClientsSummary(filtered);
    const listHtml = filtered.length ? `<div class="client-grid">${filtered.map(clientCard).join('')}</div>`
      : (totalCount ? emptyState('search', t('noResults'), t('noResultsSub'), false)
                    : emptyState('users', t('noClients'), t('noClientsSub'), true));
    return summaryHtml + listHtml;
  }

  function clientCard(c, idx) {
    const total = clientTotal(c), paid = clientPaid(c), rest = clientRest(c);
    const pct = total > 0 ? Math.min(100, (paid / total) * 100) : 0;
    const cleared = rest <= 0 && total > 0;
    const prods = (c.products || []);
    return `
      <div class="client-card" style="animation-delay:${(idx || 0) * 0.05}s">
        <div class="cc-head">
          ${cleared ? `<div class="paid-badge">${ic.checkCircle}${esc(t('fullyPaid'))}</div>` : ''}
          <div class="cc-top">
            <div class="avatar">${esc(initials(c.fullName))}</div>
            <div><div class="cc-name">${esc(c.fullName)}</div><div class="cc-phone">${ic.phone}${esc(c.phone || '—')}</div></div>
          </div>
        </div>
        <div class="cc-body">
          <div class="cc-products">
            <div class="lbl">${esc(t('purchases'))} · ${prods.length} ${esc(t('pieces'))}</div>
            <div>${prods.slice(0, 3).map(p => `<span class="chip">${ic.box}${esc(p.name)} · <b>${money(p.price)}</b></span>`).join('')}
              ${prods.length > 3 ? `<span class="chip">+${prods.length - 3}</span>` : ''}
              ${prods.length === 0 ? `<span class="chip">${esc(t('noProducts'))}</span>` : ''}</div>
          </div>
          <div class="cc-figures">
            <div class="fig total"><div class="fig-lbl">${esc(t('total'))}</div><div class="fig-val">${money(total)}</div></div>
            <div class="fig paid"><div class="fig-lbl">${esc(t('paid'))}</div><div class="fig-val">${money(paid)}</div></div>
            <div class="fig rest ${cleared ? 'clear' : ''}"><div class="fig-lbl">${esc(t('rest'))}</div><div class="fig-val">${money(rest)}</div></div>
          </div>
          <div class="progress"><span style="width:${pct}%"></span></div>
        </div>
        <div class="cc-actions">
          <div class="ca-row">
            <button class="btn ghost sm" data-act="view" data-id="${c.id}" title="${esc(t('view'))}">${ic.eye}<span>${esc(t('view'))}</span></button>
            <button class="btn pay sm" data-act="pay" data-id="${c.id}" title="${esc(t('payment'))}" ${cleared ? 'disabled' : ''}>${ic.cash}<span>${esc(t('payment'))}</span></button>
          </div>
          <div class="ca-row">
            <button class="btn violet sm" data-act="history" data-id="${c.id}" title="${esc(t('history'))}">${ic.clock}<span>${esc(t('history'))}</span></button>
            <button class="btn ghost icon sm" data-act="edit" data-id="${c.id}" title="${esc(t('edit'))}">${ic.pencil}</button>
            <button class="btn ghost icon sm" data-act="delete" data-id="${c.id}" title="${esc(t('delete'))}" style="color:var(--c-danger)">${ic.trash}</button>
          </div>
        </div>
      </div>`;
  }

  function emptyState(icon, title, sub, showAdd) {
    return `<div class="empty-state">
      <div class="ei">${ic[icon]}</div><h3>${esc(title)}</h3><p>${esc(sub)}</p>
      ${showAdd ? `<button class="btn" id="add-client-empty">${ic.plus}<span>${esc(t('addFirstClient'))}</span></button>` : ''}
    </div>`;
  }

  function bindClientCardActions() {
    document.querySelectorAll('[data-act]').forEach(btn => btn.addEventListener('click', () => {
      const id = btn.dataset.id, act = btn.dataset.act;
      if (act === 'view') openDetailsModal(id);
      else if (act === 'edit') openClientModal(id);
      else if (act === 'delete') openDeleteModal(id);
      else if (act === 'pay') openPaymentModal(id);
      else if (act === 'history') openHistoryModal(id);
    }));
    document.querySelectorAll('[data-open-client]').forEach(el => el.addEventListener('click', () => openDetailsModal(el.dataset.openClient)));
    const addEmpty = $('#add-client-empty'); if (addEmpty) addEmpty.addEventListener('click', () => openClientModal(null));
  }

  function updateFilteredClientsUI() {
    const container = $('#clients-list-container');
    if (container) {
      const filtered = getFilteredClients();
      container.innerHTML = renderClientsGridContent(filtered, state.clients.length);
      bindClientCardActions();
    }
  }

  function bindClients() {
    const search = $('#client-search');
    if (search) {
      search.addEventListener('input', (e) => {
        state.search = e.target.value;
        updateFilteredClientsUI();
      });
    }

    // Status filter buttons
    document.querySelectorAll('.filter-status-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-status-btn').forEach(b => {
          b.classList.add('ghost');
          b.classList.remove('money', 'danger');
        });
        
        state.filterStatus = btn.dataset.status;
        
        if (state.filterStatus === 'all') {
          btn.classList.remove('ghost');
        } else if (state.filterStatus === 'paid') {
          btn.classList.remove('ghost');
          btn.classList.add('money');
        } else if (state.filterStatus === 'debt') {
          btn.classList.remove('ghost');
          btn.classList.add('danger');
        }
        
        updateFilteredClientsUI();
      });
    });

    // Time filter buttons
    document.querySelectorAll('.filter-time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-time-btn').forEach(b => {
          b.classList.add('ghost');
          b.classList.remove('violet');
        });
        
        state.filterTime = btn.dataset.time;
        
        if (state.filterTime === 'all') {
          btn.classList.remove('ghost');
        } else {
          btn.classList.remove('ghost');
          btn.classList.add('violet');
        }
        
        updateFilteredClientsUI();
      });
    });

    const addBtn = $('#add-client-btn'); if (addBtn) addBtn.addEventListener('click', () => openClientModal(null));
    bindClientCardActions();
  }

  /* ---------------------------------------------------------
     11. MODAL PLUMBING
     --------------------------------------------------------- */
  function openModal(html, opts) {
    opts = opts || {};
    const root = document.getElementById('modal-root');
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `<div class="modal ${opts.size || ''}">${html}</div>`;
    root.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    overlay.addEventListener('mousedown', (e) => { if (e.target === overlay) closeModal(overlay); });
    const closeBtn = overlay.querySelector('[data-close]');
    if (closeBtn) closeBtn.addEventListener('click', () => closeModal(overlay));
    const onKey = (e) => { if (e.key === 'Escape') { closeModal(overlay); document.removeEventListener('keydown', onKey); } };
    document.addEventListener('keydown', onKey);
    return overlay;
  }
  function closeModal(overlay) {
    overlay.classList.add('closing');
    setTimeout(() => { overlay.remove(); if (!document.querySelector('.modal-overlay')) document.body.style.overflow = ''; }, 300);
  }
  function modalHead(icon, gradient, title, sub) {
    return `<div class="modal-head">
      <div class="mh-title"><div class="mh-icon" style="background:${gradient}">${ic[icon]}</div>
        <div><h3>${esc(title)}</h3>${sub ? `<p>${esc(sub)}</p>` : ''}</div></div>
      <button class="modal-close" data-close>${ic.x}</button></div>`;
  }
  function setBusyBtn(btn, on, html) { if (!btn) return; btn.disabled = on; btn.innerHTML = on ? `<span class="spinner sm"></span>` : html; }

  /* ---------------------------------------------------------
     12. CLIENT FORM MODAL
     --------------------------------------------------------- */
  function openClientModal(id) {
    const editing = !!id;
    const client = editing ? getClient(id) : null;
    let products = editing ? client.products.map(p => ({ ...p })) : [{ id: uid(), name: '', description: '', price: '' }];
    const dt = getLocalDateAndTime(client ? client.createdAt : null);

    const html = `
      ${modalHead('users', 'var(--g-brand)', editing ? t('editClientTitle') : t('newClientTitle'), t('newClientSub'))}
      <div class="modal-body">
        <div id="cf-err"></div>
        <div class="info-block">
          <div class="lbl">${esc(t('clientInfo'))}</div>
          <div class="field"><label>${esc(t('fullName'))} *</label>
            <input class="input" id="cf-name" placeholder="${esc(t('namePh'))}" value="${esc(client ? client.fullName : '')}" /></div>
          <div class="grid-2">
            <div class="field"><label>${esc(t('phone'))} *</label>
              <input class="input" id="cf-phone" placeholder="${esc(t('phonePh'))}" value="${esc(client ? client.phone : '')}" /></div>
            <div class="field"><label>${esc(t('address'))}</label>
              <input class="input" id="cf-address" placeholder="${esc(t('addressPh'))}" value="${esc(client ? client.address : '')}" /></div>
          </div>
          <div class="grid-2" style="margin-top: 14px">
            <div class="field"><label>${esc(t('date'))}</label>
              <input class="input" id="cf-date" type="date" value="${dt.date}" /></div>
            <div class="field"><label>${esc(t('time'))}</label>
              <input class="input" id="cf-time" type="time" value="${dt.time}" /></div>
          </div>
        </div>
        <div class="info-block">
          <div class="lbl">${esc(t('productsSold'))}</div>
          <div class="prod-list" id="prod-list"></div>
          <button class="btn ghost sm" id="add-prod" type="button">${ic.plus}<span>${esc(t('addProduct'))}</span></button>
        </div>
        ${!editing ? `<div class="info-block"><div class="lbl">${esc(t('initialPayment'))}</div>
          <div class="field"><label>${esc(t('amountPaidNow'))}</label>
            <input class="input" id="cf-paid" type="number" min="0" step="1" placeholder="0" /></div></div>` : ''}
        <div class="calc-box" id="cf-calc"></div>
      </div>
      <div class="modal-foot">
        <button class="btn ghost" data-close>${esc(t('cancel'))}</button>
        <button class="btn money" id="cf-save">${ic.check}<span>${esc(editing ? t('save') : t('create'))}</span></button>
      </div>`;

    const overlay = openModal(html);
    const saveHtml = `${ic.check}<span>${esc(editing ? t('save') : t('create'))}</span>`;

    function renderProducts() {
      const list = $('#prod-list', overlay);
      list.innerHTML = products.map((p, i) => `
        <div class="prod-row" data-i="${i}">
          <input class="input pr-name" placeholder="${esc(t('productNamePh'))}" value="${esc(p.name)}" />
          <input class="input pr-desc" placeholder="${esc(t('productDescPh'))}" value="${esc(p.description)}" />
          <input class="input pr-price" type="number" min="0" step="1" placeholder="${esc(t('price'))}" value="${esc(p.price)}" />
          <button class="rm" type="button" ${products.length === 1 ? 'style="opacity:.4"' : ''}>${ic.trash}</button>
        </div>`).join('');
      list.querySelectorAll('.prod-row').forEach(row => {
        const i = Number(row.dataset.i);
        row.querySelector('.pr-name').addEventListener('input', e => { products[i].name = e.target.value; });
        row.querySelector('.pr-desc').addEventListener('input', e => { products[i].description = e.target.value; });
        row.querySelector('.pr-price').addEventListener('input', e => { products[i].price = e.target.value; updateCalc(); });
        row.querySelector('.rm').addEventListener('click', () => {
          if (products.length === 1) products[0] = { id: uid(), name: '', description: '', price: '' };
          else products.splice(i, 1);
          renderProducts(); updateCalc();
        });
      });
    }
    function updateCalc() {
      const total = products.reduce((s, p) => s + (Number(p.price) || 0), 0);
      const paidInput = $('#cf-paid', overlay);
      const paid = editing ? clientPaid(client) : (Number(paidInput && paidInput.value) || 0);
      const rest = Math.max(0, total - paid), cleared = rest <= 0 && total > 0;
      $('#cf-calc', overlay).innerHTML = `
        <div class="calc-row total"><span class="lbl">${ic.coins} ${esc(t('totalAmount'))}</span><span class="val">${money(total)}</span></div>
        <div class="calc-row paid"><span class="lbl">${ic.cash} ${esc(t('paid'))}</span><span class="val">${money(paid)}</span></div>
        <div class="calc-row rest ${cleared ? 'clear' : ''}"><span class="lbl">${ic.wallet} ${esc(t('remaining'))}</span><span class="val">${money(rest)}</span></div>`;
    }
    renderProducts(); updateCalc();
    $('#add-prod', overlay).addEventListener('click', () => { products.push({ id: uid(), name: '', description: '', price: '' }); renderProducts(); updateCalc(); });
    const paidInput = $('#cf-paid', overlay); if (paidInput) paidInput.addEventListener('input', updateCalc);

    $('#cf-save', overlay).addEventListener('click', async () => {
      const name = $('#cf-name', overlay).value.trim();
      const phone = $('#cf-phone', overlay).value.trim();
      const address = $('#cf-address', overlay).value.trim();
      const dateVal = $('#cf-date', overlay).value;
      const timeVal = $('#cf-time', overlay).value;
      
      let customDateIso = new Date().toISOString();
      if (dateVal) {
        const [yr, mo, dy] = dateVal.split('-').map(Number);
        const [hr, mn] = (timeVal || '00:00').split(':').map(Number);
        const dateObj = new Date(yr, mo - 1, dy, hr, mn);
        customDateIso = dateObj.toISOString();
      }

      const errBox = $('#cf-err', overlay);
      const showErr = (m) => { errBox.innerHTML = `<div class="form-err">${esc(m)}</div>`; };
      if (!name) return showErr(t('errName'));
      if (!phone) return showErr(t('errPhone'));
      const validProds = products.filter(p => p.name.trim() && Number(p.price) > 0)
        .map(p => ({ id: p.id || uid(), name: p.name.trim(), description: p.description.trim(), price: Number(p.price) }));
      if (!validProds.length) return showErr(t('errProducts'));

      const saveBtn = $('#cf-save', overlay);
      setBusyBtn(saveBtn, true);
      try {
        if (editing) {
          await backend().updateClient(id, { fullName: name, phone, address, products: validProds, createdAt: customDateIso });
          closeModal(overlay); rerenderCurrentView(); toast(t('clientUpdated'), 'success');
        } else {
          const total = validProds.reduce((s, p) => s + p.price, 0);
          const paid = Math.min(Number($('#cf-paid', overlay).value) || 0, total);
          await backend().createClient({ fullName: name, phone, address, products: validProds, initialPaid: paid, createdAt: customDateIso });
          closeModal(overlay); rerenderCurrentView(); toast(t('clientCreated'), 'success');
        }
      } catch (e) { setBusyBtn(saveBtn, false, saveHtml); showErr(t('errServer')); }
    });
  }

  /* ---------------------------------------------------------
     13. DETAILS MODAL
     --------------------------------------------------------- */
  function openDetailsModal(id) {
    const c = getClient(id); if (!c) return;
    const total = clientTotal(c), paid = clientPaid(c), rest = clientRest(c);
    const cleared = rest <= 0 && total > 0;
    const payments = [...(c.payments || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

    const html = `
      ${modalHead('users', 'var(--g-brand)', t('detailsTitle'), '')}
      <div class="modal-body">
        <div class="detail-hero">
          <div class="avatar">${esc(initials(c.fullName))}</div>
          <div style="min-width:0"><h3>${esc(c.fullName)}</h3>
            <div class="meta">
              <span>${ic.phone}${esc(c.phone || '—')}</span>
              ${c.address ? `<span>${ic.pin}${esc(c.address)}</span>` : ''}
              <span>${ic.calendar}${esc(t('memberSince'))} ${esc(fmtDate(c.createdAt))}</span>
            </div></div>
        </div>
        <div class="info-block"><div class="lbl">${esc(t('products'))}</div>
          <div class="table-scroll"><table class="data-table">
            <thead><tr><th>${esc(t('productName'))}</th><th>${esc(t('description'))}</th><th class="num">${esc(t('price'))}</th></tr></thead>
            <tbody>${(c.products || []).map(p => `<tr><td><b>${esc(p.name)}</b></td><td class="text-muted">${esc(p.description || '—')}</td><td class="num">${money(p.price)}</td></tr>`).join('') || `<tr><td colspan="3" class="text-muted">${esc(t('noProducts'))}</td></tr>`}</tbody>
            <tfoot><tr><td colspan="2">${esc(t('total'))}</td><td class="num">${money(total)}</td></tr></tfoot>
          </table></div>
        </div>
        <div class="info-block"><div class="lbl">${esc(t('paymentSummary'))}</div>
          <div class="calc-box">
            <div class="calc-row total"><span class="lbl">${ic.coins} ${esc(t('total'))}</span><span class="val">${money(total)}</span></div>
            <div class="calc-row paid"><span class="lbl">${ic.cash} ${esc(t('paid'))}</span><span class="val">${money(paid)}</span></div>
            <div class="calc-row rest ${cleared ? 'clear' : ''}"><span class="lbl">${ic.wallet} ${esc(t('rest'))}</span><span class="val">${money(rest)}</span></div>
          </div></div>
        <div class="info-block"><div class="lbl">${esc(t('latestPayments'))}</div>
          <div class="timeline">${payments.length ? payments.slice(0, 4).map(paymentTimelineItem).join('') : `<div class="text-muted" style="padding:8px">${esc(t('noPayments'))}</div>`}</div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn ghost" data-close>${esc(t('cancel'))}</button>
        <button class="btn violet" id="d-history">${ic.clock}<span>${esc(t('history'))}</span></button>
        <button class="btn pay" id="d-pay" ${cleared ? 'disabled' : ''}>${ic.cash}<span>${esc(t('payment'))}</span></button>
      </div>`;
    const overlay = openModal(html, { size: 'wide' });
    $('#d-history', overlay).addEventListener('click', () => { closeModal(overlay); setTimeout(() => openHistoryModal(id), 160); });
    const payBtn = $('#d-pay', overlay);
    if (payBtn && !cleared) payBtn.addEventListener('click', () => { closeModal(overlay); setTimeout(() => openPaymentModal(id), 160); });
  }

  function paymentTimelineItem(p) {
    const isInit = p.type === 'initial';
    return `<div class="tl-item">
      <div class="tl-dot ${isInit ? 'initial' : ''}">${isInit ? ic.coins : ic.cash}</div>
      <div class="tl-main">
        <div class="tl-top"><span class="tl-type">${esc(isInit ? t('initialPaymentLabel') : t('paymentLabel'))}
          <span class="tag ${isInit ? 'violet' : 'green'}">${esc(isInit ? t('initialPaymentLabel') : t('paymentLabel'))}</span></span>
          <span class="tl-amount">+${money(p.amount)}</span></div>
        <div class="tl-date">${ic.clock}${esc(fmtDateTime(p.date))}</div>
      </div></div>`;
  }

  /* ---------------------------------------------------------
     14. PAYMENT MODAL
     --------------------------------------------------------- */
  function openPaymentModal(id) {
    const c = getClient(id); if (!c) return;
    const total = clientTotal(c), paid = clientPaid(c), rest = clientRest(c);
    const dt = getLocalDateAndTime(null);

    const html = `
      ${modalHead('cash', 'var(--g-pay)', t('makePayment'), c.fullName)}
      <div class="modal-body">
        <div class="calc-box" style="background:linear-gradient(135deg,#eff6ff,#eef2ff)">
          <div class="calc-row total"><span class="lbl">${ic.coins} ${esc(t('currentTotal'))}</span><span class="val">${money(total)}</span></div>
          <div class="calc-row paid"><span class="lbl">${ic.cash} ${esc(t('alreadyPaid'))}</span><span class="val">${money(paid)}</span></div>
          <div class="calc-row rest"><span class="lbl">${ic.wallet} ${esc(t('currentRest'))}</span><span class="val">${money(rest)}</span></div>
        </div>
        <div id="pay-err"></div>
        <div class="field mt-16"><label>${esc(t('payNow'))} *</label>
          <input class="input" id="pay-amount" type="number" min="0" step="1" max="${rest}" placeholder="0" /></div>
        <button class="btn ghost block sm" id="pay-full" type="button" style="margin-bottom: 14px">${ic.check}<span>${esc(t('payFull'))} (${money(rest)})</span></button>
        <div class="grid-2">
          <div class="field"><label>${esc(t('date'))}</label>
            <input class="input" id="pay-date" type="date" value="${dt.date}" /></div>
          <div class="field"><label>${esc(t('time'))}</label>
            <input class="input" id="pay-time" type="time" value="${dt.time}" /></div>
        </div>
        <div class="calc-box mt-16" id="pay-preview">
          <div class="calc-row rest"><span class="lbl">${ic.wallet} ${esc(t('newRest'))}</span><span class="val">${money(rest)}</span></div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn ghost" data-close>${esc(t('cancel'))}</button>
        <button class="btn money" id="pay-save">${ic.check}<span>${esc(t('savePayment'))}</span></button>
      </div>`;
    const overlay = openModal(html, { size: 'narrow' });
    const input = $('#pay-amount', overlay), preview = $('#pay-preview', overlay);
    const saveHtml = `${ic.check}<span>${esc(t('savePayment'))}</span>`;
    function updatePreview() {
      const amt = Number(input.value) || 0, newRest = Math.max(0, rest - amt), cleared = newRest <= 0;
      preview.innerHTML = `<div class="calc-row rest ${cleared ? 'clear' : ''}"><span class="lbl">${ic.wallet} ${esc(t('newRest'))}</span><span class="val">${money(newRest)}</span></div>`;
    }
    input.addEventListener('input', updatePreview); input.focus();
    $('#pay-full', overlay).addEventListener('click', () => { input.value = rest; updatePreview(); });
    $('#pay-save', overlay).addEventListener('click', async () => {
      const amt = Number(input.value), errBox = $('#pay-err', overlay);
      const dateVal = $('#pay-date', overlay).value;
      const timeVal = $('#pay-time', overlay).value;
      
      let customDateIso = new Date().toISOString();
      if (dateVal) {
        const [yr, mo, dy] = dateVal.split('-').map(Number);
        const [hr, mn] = (timeVal || '00:00').split(':').map(Number);
        const dateObj = new Date(yr, mo - 1, dy, hr, mn);
        customDateIso = dateObj.toISOString();
      }

      if (!amt || amt <= 0) { errBox.innerHTML = `<div class="form-err">${esc(t('errAmount'))}</div>`; return; }
      if (amt > rest + 0.001) { errBox.innerHTML = `<div class="form-err">${esc(t('errAmountMax'))}</div>`; return; }
      const saveBtn = $('#pay-save', overlay); setBusyBtn(saveBtn, true);
      try {
        await backend().addPayment(id, Math.round(amt), customDateIso);
        closeModal(overlay); rerenderCurrentView(); toast(t('paymentSaved') + ' · +' + money(amt), 'success');
      } catch (e) { setBusyBtn(saveBtn, false, saveHtml); errBox.innerHTML = `<div class="form-err">${esc(t('errServer'))}</div>`; }
    });
  }

  /* ---------------------------------------------------------
     15. HISTORY MODAL
     --------------------------------------------------------- */
  function openHistoryModal(id) {
    const c = getClient(id); if (!c) return;
    const total = clientTotal(c), paid = clientPaid(c), rest = clientRest(c);
    const payments = [...(c.payments || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
    const cleared = rest <= 0 && total > 0;
    const html = `
      ${modalHead('clock', 'var(--g-violet)', t('historyTitle'), `${t('historyFor')} ${c.fullName}`)}
      <div class="modal-body">
        <div class="calc-box" style="margin-bottom:20px">
          <div class="calc-row total"><span class="lbl">${ic.coins} ${esc(t('total'))}</span><span class="val">${money(total)}</span></div>
          <div class="calc-row paid"><span class="lbl">${ic.cash} ${esc(t('totalPaidLabel'))}</span><span class="val">${money(paid)}</span></div>
          <div class="calc-row rest ${cleared ? 'clear' : ''}"><span class="lbl">${ic.wallet} ${esc(t('rest'))}</span><span class="val">${money(rest)}</span></div>
        </div>
        <div class="info-block"><div class="lbl">${esc(t('historyTitle'))} · ${payments.length}</div>
          <div class="timeline">${payments.length ? payments.map(paymentTimelineItem).join('')
            : `<div class="empty-state" style="padding:40px 10px"><div class="ei" style="width:70px;height:70px">${ic.clock}</div><p>${esc(t('noPayments'))}</p></div>`}</div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn ghost" data-close>${esc(t('cancel'))}</button>
        <button class="btn pay" id="h-pay" ${cleared ? 'disabled' : ''}>${ic.cash}<span>${esc(t('payment'))}</span></button>
      </div>`;
    const overlay = openModal(html);
    const payBtn = $('#h-pay', overlay);
    if (payBtn && !cleared) payBtn.addEventListener('click', () => { closeModal(overlay); setTimeout(() => openPaymentModal(id), 160); });
  }

  /* ---------------------------------------------------------
     16. DELETE CONFIRM MODAL
     --------------------------------------------------------- */
  function openDeleteModal(id) {
    const c = getClient(id); if (!c) return;
    const html = `
      ${modalHead('trash', 'var(--g-danger)', t('confirmDelete'), t('confirmDeleteSub'))}
      <div class="modal-body">
        <p style="font-size:15px;line-height:1.6">${esc(t('deleteMsg'))} <b>${esc(c.fullName)}</b> ?</p>
        <div class="form-err" style="margin-top:14px;background:#fff7ed;color:#9a3412;border-color:#fed7aa">${esc(t('deleteWarn'))}</div>
      </div>
      <div class="modal-foot">
        <button class="btn ghost" data-close>${esc(t('keepIt'))}</button>
        <button class="btn danger" id="del-confirm">${ic.trash}<span>${esc(t('yesDelete'))}</span></button>
      </div>`;
    const overlay = openModal(html, { size: 'narrow' });
    const delHtml = `${ic.trash}<span>${esc(t('yesDelete'))}</span>`;
    $('#del-confirm', overlay).addEventListener('click', async () => {
      const btn = $('#del-confirm', overlay); setBusyBtn(btn, true);
      try { await backend().deleteClient(id); closeModal(overlay); rerenderCurrentView(); toast(t('clientDeleted'), 'info'); }
      catch (e) { setBusyBtn(btn, false, delHtml); toast(t('errServer'), 'err'); }
    });
  }

  /* ---------------------------------------------------------
     17. REPORTS
     --------------------------------------------------------- */
  function viewReports() {
    return `<div class="view">
      <div class="report-form">
        <div class="field"><label>${esc(t('startDate'))}</label><input class="input" id="rp-start" type="date" value="${state._rpStart || ''}" /></div>
        <div class="field"><label>${esc(t('endDate'))}</label><input class="input" id="rp-end" type="date" value="${state._rpEnd || ''}" /></div>
        <button class="btn" id="rp-gen">${ic.report}<span>${esc(t('generate'))}</span></button>
      </div>
      <div id="rp-results">${state._rpGenerated ? reportResults() : reportPlaceholder()}</div>
    </div>`;
  }
  function reportPlaceholder() {
    return `<div class="empty-state"><div class="ei">${ic.report}</div><h3>${esc(t('selectPeriod'))}</h3><p>${esc(t('generateHint'))}</p></div>`;
  }
  function reportResults() {
    const clients = state.clients;
    const start = state._rpStart ? new Date(state._rpStart + 'T00:00:00') : null;
    const end = state._rpEnd ? new Date(state._rpEnd + 'T23:59:59') : null;
    const inRange = (iso) => { const d = new Date(iso); if (start && d < start) return false; if (end && d > end) return false; return true; };
    const rows = clients.map(c => ({ c, total: clientTotal(c), paidAll: clientPaid(c), rest: clientRest(c),
      paidInRange: (c.payments || []).filter(p => inRange(p.date)).reduce((s, p) => s + p.amount, 0) }));
    const totalSales = rows.reduce((s, r) => s + r.total, 0);
    const totalCollected = rows.reduce((s, r) => s + r.paidInRange, 0);
    const totalOutstanding = rows.reduce((s, r) => s + r.rest, 0);
    const payments = [];
    clients.forEach(c => (c.payments || []).forEach(p => { if (inRange(p.date)) payments.push({ c, ...p }); }));
    payments.sort((a, b) => new Date(b.date) - new Date(a.date));
    const periodLabel = (state._rpStart || state._rpEnd)
      ? `${state._rpStart ? fmtDate(state._rpStart) : '…'} → ${state._rpEnd ? fmtDate(state._rpEnd) : '…'}` : t('allTime');

    return `<div class="report-results">
      <div class="section-title"><span class="bar"></span>${esc(t('reportPeriod'))}: ${esc(periodLabel)}</div>
      <div class="stat-grid">
        <div class="stat-card c-debt"><div class="stat-icon">${ic.coins}</div><div class="stat-label">${esc(t('totalSales'))}</div><div class="stat-value">${money(totalSales)}</div></div>
        <div class="stat-card c-pay"><div class="stat-icon">${ic.cash}</div><div class="stat-label">${esc(t('totalCollected'))}</div><div class="stat-value">${money(totalCollected)}</div></div>
        <div class="stat-card c-out"><div class="stat-icon">${ic.wallet}</div><div class="stat-label">${esc(t('totalOutstanding'))}</div><div class="stat-value">${money(totalOutstanding)}</div></div>
      </div>
      <div class="section-title"><span class="bar"></span>${esc(t('clientsBreakdown'))}</div>
      <div class="panel table-scroll" style="padding:20px">
        <table class="data-table">
          <thead><tr><th>${esc(t('client'))}</th><th>${esc(t('phone'))}</th><th class="num">${esc(t('total'))}</th><th class="num">${esc(t('paid'))}</th><th class="num">${esc(t('rest'))}</th></tr></thead>
          <tbody>${rows.map(r => `<tr><td><b>${esc(r.c.fullName)}</b></td><td class="text-muted">${esc(r.c.phone || '—')}</td>
            <td class="num" style="color:var(--c-info)">${money(r.total)}</td><td class="num" style="color:var(--c-success)">${money(r.paidAll)}</td>
            <td class="num" style="color:${r.rest > 0 ? 'var(--c-warning)' : 'var(--c-success)'}">${money(r.rest)}</td></tr>`).join('') || `<tr><td colspan="5" class="text-muted">${esc(t('noClients'))}</td></tr>`}</tbody>
          <tfoot><tr><td colspan="2">${esc(t('total'))}</td><td class="num">${money(totalSales)}</td><td class="num">${money(rows.reduce((s, r) => s + r.paidAll, 0))}</td><td class="num">${money(totalOutstanding)}</td></tr></tfoot>
        </table>
      </div>
      <div class="section-title"><span class="bar"></span>${esc(t('paymentsInPeriod'))} · ${payments.length}</div>
      <div class="panel table-scroll" style="padding:20px">
        <table class="data-table">
          <thead><tr><th>${esc(t('client'))}</th><th>${esc(t('type'))}</th><th>${esc(t('date'))}</th><th class="num">${esc(t('amount'))}</th></tr></thead>
          <tbody>${payments.map(p => `<tr><td><b>${esc(p.c.fullName)}</b></td>
            <td><span class="tag ${p.type === 'initial' ? 'violet' : 'green'}">${esc(p.type === 'initial' ? t('initialPaymentLabel') : t('paymentLabel'))}</span></td>
            <td class="text-muted">${esc(fmtDateTime(p.date))}</td><td class="num" style="color:var(--c-success)">+${money(p.amount)}</td></tr>`).join('') || `<tr><td colspan="4" class="text-muted">${esc(t('noPaymentsPeriod'))}</td></tr>`}</tbody>
          <tfoot><tr><td colspan="3">${esc(t('totalCollected'))}</td><td class="num">${money(totalCollected)}</td></tr></tfoot>
        </table>
      </div>
    </div>`;
  }
  function bindReports() {
    const gen = $('#rp-gen');
    if (gen) gen.addEventListener('click', () => {
      state._rpStart = $('#rp-start').value; state._rpEnd = $('#rp-end').value; state._rpGenerated = true;
      $('#rp-results').innerHTML = reportResults();
    });
  }

  /* ---------------------------------------------------------
     18. SETTINGS
     --------------------------------------------------------- */
  function viewSettings() {
    const u = state.user;
    return `<div class="view"><div class="settings-grid">
      <div class="settings-card">
        <h3><span class="mini-icon" style="background:var(--g-brand)">${ic.user}</span>${esc(t('personalInfo'))}</h3>
        <div id="set-err-1"></div>
        <div class="field"><label>${esc(t('fullName'))}</label><input class="input" id="set-name" value="${esc(u.fullName)}" /></div>
        <div class="field"><label>${esc(t('email'))}</label><input class="input" id="set-email" type="email" value="${esc(u.email)}" ${state.demo ? '' : ''}/></div>
        <button class="btn money block" id="set-save-personal">${ic.check}<span>${esc(t('saveChanges'))}</span></button>
      </div>
      <div class="settings-card">
        <h3><span class="mini-icon" style="background:var(--g-violet)">${ic.lock}</span>${esc(t('loginInfo'))}</h3>
        <div id="set-err-2"></div>
        <div class="field"><label>${esc(t('username'))}</label><input class="input" id="set-username" value="${esc(u.username)}" /></div>
        <div class="field"><label>${esc(t('newPassword'))}</label><input class="input" id="set-password" type="password" placeholder="••••••••" /></div>
        <button class="btn violet block" id="set-save-login">${ic.lock}<span>${esc(t('changePassword'))}</span></button>
      </div>
    </div></div>`;
  }
  function bindSettings() {
    $('#set-save-personal').addEventListener('click', async () => {
      const name = $('#set-name').value.trim(), email = $('#set-email').value.trim(), err = $('#set-err-1');
      if (!name) { err.innerHTML = `<div class="form-err">${esc(t('errName'))}</div>`; return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.innerHTML = `<div class="form-err">${esc(t('errEmail'))}</div>`; return; }
      const btn = $('#set-save-personal'); const h = btn.innerHTML; setBusyBtn(btn, true);
      try { await backend().updateProfile({ fullName: name, email }); renderShell(); toast(t('settingsSaved'), 'success'); }
      catch (e) { setBusyBtn(btn, false, h); err.innerHTML = `<div class="form-err">${esc(t('errServer'))}</div>`; }
    });
    $('#set-save-login').addEventListener('click', async () => {
      const username = $('#set-username').value.trim(), password = $('#set-password').value, err = $('#set-err-2');
      if (!username) { err.innerHTML = `<div class="form-err">${esc(t('errRequired'))}</div>`; return; }
      if (password && password.length < 6) { err.innerHTML = `<div class="form-err">${esc(t('errPassLen'))}</div>`; return; }
      const btn = $('#set-save-login'); const h = btn.innerHTML; setBusyBtn(btn, true);
      try { await backend().updateProfile({ username, password: password || undefined }); renderShell(); toast(t('settingsSaved'), 'success'); }
      catch (e) { setBusyBtn(btn, false, h); err.innerHTML = `<div class="form-err">${esc(t('errServer'))}</div>`; }
    });
  }

  /* ---------------------------------------------------------
     19. TOASTS
     --------------------------------------------------------- */
  function toast(msg, type) {
    const root = document.getElementById('toast-root');
    const el = document.createElement('div');
    el.className = 'toast ' + (type === 'err' ? 'err' : type === 'info' ? 'info' : '');
    const icon = type === 'err' ? ic.x : type === 'info' ? ic.clock : ic.check;
    el.innerHTML = `<div class="t-ic">${icon}</div><div>${esc(msg)}</div>`;
    root.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 400); }, 3400);
  }

  /* ---------------------------------------------------------
     20. INIT
     --------------------------------------------------------- */
  async function init() {
    applyLangAttrs();
    const s = getSb();
    if (s) {
      showLoader();
      try {
        const { data: { session } } = await s.auth.getSession();
        if (session) { await enterApp(session); return; }
      } catch (e) {}
      await refreshAdminExists();
      hideLoader();
    } else {
      state.adminExists = false;
    }
    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
