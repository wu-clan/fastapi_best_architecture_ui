export default {
  'menu.automation.codeGenerator': 'Code Generator',
  // card
  'menu.automation.card.dataImport': 'Data Import',
  'menu.automation.card.codeGenerate': 'Code Generate',
  // tooltip
  'automation.code-gen.tooltip.import':
    'Import: Import specified database tables from the specified database, ' +
    'automatically creating businesses and models for code generation',
  'automation.code-gen.tooltip.business':
    'Business: Related configurations for code generation ' +
    '(some functions require selecting a business before performing operations)',
  'automation.code-gen.tooltip.model':
    'Model: Related model columns for code generation (by default, there is an ' +
    'auto-increment primary key column "id" and default time columns, please check the business configuration)',
  'automation.code-gen.tooltip.gen':
    'This function will perform disk writes, please operate with caution',
  'automation.code-gen.button.tooltip.business':
    'This function may be deprecated, it is recommended to use the import function first',
  'automation.code-gen.tooltip.code.copy': 'Copy Code',
  // button
  'automation.code-gen.button.getDB': 'Get Database Tables',
  'automation.code-gen.button.getDB.req': 'Get',
  'automation.code-gen.button.import': 'Import',
  'automation.code-gen.button.business': 'Create Business Table',
  'automation.code-gen.button.model': 'Create Model Columns',
  'automation.code-gen.button.preview': 'Preview',
  'automation.code-gen.button.write': 'Generate',
  'automation.code-gen.button.download': 'Download',
  // columns
  'automation.code-gen.columns.app_name': 'Application Name',
  'automation.code-gen.columns.table_name_en': 'Table Name (EN)',
  'automation.code-gen.columns.table_name_zh': 'Table Name (ZH)',
  'automation.code-gen.columns.table_simple_name_zh': 'Table Simple Name (ZH)',
  'automation.code-gen.columns.table_comment': 'Table Description',
  'automation.code-gen.columns.schema_name': 'Schema Name',
  'automation.code-gen.columns.default_datetime_column':
    'Default Datetime Column',
  'automation.code-gen.columns.api_version': 'API Version',
  'automation.code-gen.columns.gen_path': 'Generation Path',
  'automation.code-gen.columns.remark': 'Remark',
  'automation.code-gen.columns.operate': 'Operate',
  'automation.code-gen.columns.name': 'Name',
  'automation.code-gen.columns.comment': 'Description',
  'automation.code-gen.columns.type': 'SQLA Type',
  'automation.code-gen.columns.pd_type': 'Pydantic Type',
  'automation.code-gen.columns.default': 'Default Value',
  'automation.code-gen.columns.sort': 'Sort',
  'automation.code-gen.columns.length': 'Length',
  'automation.code-gen.columns.is_pk': 'Primary Key',
  'automation.code-gen.columns.is_nullable': 'Nullable',
  // form
  'automation.code-gen.form.db_name': 'Database Name',
  'automation.code-gen.form.db_name.placeholder':
    'Please enter the database name',
  'automation.code-gen.form.db_name.help':
    'Database name is required and only supports lowercase letters and underscores',
  'automation.code-gen.form.db_name.tooltip':
    'It is recommended to be the same as the "Get Database Tables" parameter',
  'automation.code-gen.form.app': 'Application Name',
  'automation.code-gen.form.app.tooltip':
    'Used to generate code to the specified backend app',
  'automation.code-gen.form.app.placeholder':
    'Please enter the application name',
  'automation.code-gen.form.app.help':
    'Application name is required and only supports lowercase letters and underscores',
  'automation.code-gen.form.table_name': 'Database Table Name',
  'automation.code-gen.form.table_name.tooltip':
    'Table name obtained through "Get Database Tables"',
  'automation.code-gen.form.table_name.placeholder':
    'Please enter the database table name',
  'automation.code-gen.form.table_name.help':
    'Database table name is required and only supports lowercase letters and underscores',
  'automation.code-gen.form.name': 'Name',
  'automation.code-gen.form.name.placeholder': 'Please enter the name',
  'automation.code-gen.form.name.help': 'Name is required',
  'automation.code-gen.form.comment': 'Description',
  'automation.code-gen.form.comment.placeholder':
    'Please enter the description',
  'automation.code-gen.form.type': 'SQLA Type',
  'automation.code-gen.form.type.placeholder':
    'Please select SQLA type (alphabetical order)',
  'automation.code-gen.form.type.help': 'SQLA type is required',
  'automation.code-gen.form.default': 'Default Value',
  'automation.code-gen.form.default.placeholder':
    'Please enter the default value',
  'automation.code-gen.form.sort': 'Sort',
  'automation.code-gen.form.sort.placeholder': 'Please enter the sort order',
  'automation.code-gen.form.sort.help': 'Sort order is required',
  'automation.code-gen.form.length': 'Length',
  'automation.code-gen.form.length.placeholder': 'Please enter the length',
  'automation.code-gen.form.length.help': 'Length is required',
  'automation.code-gen.form.is_pk': 'Primary Key',
  'automation.code-gen.form.is_pk.tooltip':
    'The default primary key is "id", it is not recommended to enable this',
  'automation.code-gen.form.is_nullable': 'Is Nullable',
  'automation.code-gen.form.gen_business_id': 'Business Binding',
  'automation.code-gen.form.gen_business_id.placeholder':
    'Please select a business',
  'automation.code-gen.form.gen_business_id.help': 'Business is required',
  'automation.code-gen.form.app_name': 'Application Name',
  'automation.code-gen.form.app_name.tooltip':
    'Code will be generated under this app directory',
  'automation.code-gen.form.app_name.placeholder':
    'Please enter the application name',
  'automation.code-gen.form.app_name.help': 'Application name is required',
  'automation.code-gen.form.table_name_en': 'Table Name (EN)',
  'automation.code-gen.form.table_name_en.placeholder':
    'Please enter the English table name',
  'automation.code-gen.form.table_name_en.help':
    'English table name is required',
  'automation.code-gen.form.table_name_zh': 'Table Name (ZH)',
  'automation.code-gen.form.table_name_zh.placeholder':
    'Please enter the Chinese table name',
  'automation.code-gen.form.table_name_zh.help':
    'Chinese table name is required and only allows Chinese characters',
  'automation.code-gen.form.table_simple_name_zh': 'Table Simple Name (ZH)',
  'automation.code-gen.form.table_simple_name_zh.placeholder':
    'Please enter the short Chinese table name',
  'automation.code-gen.form.table_simple_name_zh.help':
    'Short Chinese name is required and only allows Chinese characters',
  'automation.code-gen.form.table_comment': 'Table Description',
  'automation.code-gen.form.table_comment.placeholder':
    'Please enter the table description',
  'automation.code-gen.form.schema_name': 'Schema Name',
  'automation.code-gen.form.schema_name.tooltip':
    'Defaults to the English table name',
  'automation.code-gen.form.schema_name.placeholder':
    'Please enter the Schema name',
  'automation.code-gen.form.default_datetime_column': 'Default Datetime Column',
  'automation.code-gen.form.default_datetime_column.tooltip':
    'Whether the business model includes the default time columns "created_time" and "updated_time"',
  'automation.code-gen.form.api_version': 'API Version',
  'automation.code-gen.form.api_version.tooltip':
    'It is recommended to enter the default API version: v1',
  'automation.code-gen.form.api_version.placeholder':
    'Please enter the API version',
  'automation.code-gen.form.api_version.help': 'API version is required',
  'automation.code-gen.form.gen_path': 'Generate Path',
  'automation.code-gen.form.gen_path.tooltip':
    "The default code is generated into the current project's `app` directory. " +
    'When a custom path is specified, the generation rule is: custom path + `app/...`. For example, ' +
    'if the custom path is `"root/fba/backend"`, the final code will be generated into the `"root/fba/backend/app/..."` directory.',
  'automation.code-gen.form.gen_path.placeholder':
    'Please enter the generation path',
  'automation.code-gen.form.remark': 'Remark',
  'automation.code-gen.form.remark.placeholder': 'Please enter the remark',
  // list
  'automation.code-gen.list.header': 'Database Table List',
  // modal
  'automation.code-gen.modal.import': 'Import',
  'automation.code-gen.modal.business': 'Create Business',
  'automation.code-gen.modal.business.edit': 'Edit Business',
  'automation.code-gen.modal.business.delete':
    'Deleting the business will also delete all associated model columns, are you sure you want to delete?',
  'automation.code-gen.modal.model': 'Create Model Columns',
  'automation.code-gen.modal.model.edit': 'Edit Model Columns',
  'automation.code-gen.modal.generate': 'Code Generation',
  'automation.code-gen.modal.generate.warning':
    'Code generation will perform disk I/O writes. If the generated code files ' +
    'overlap with the current system code files, the files will be overwritten. Please operate with caution!',
  'automation.code-gen.modal.generate.okText': 'Don’t worry! Just do it!',
  'automation.code-gen.modal.generate.list.header': 'Code Write Path',
  'automation.code-gen.modal.generate.submit': 'Code Generation Successful',
  // alert
  'automation.code-gen.alert.getDB':
    'Only supports querying existing databases within the currently connected system, (database name not database table name)',
  // table
  'automation.code-gen.table.model.empty':
    'No model data for this business yet',
};
