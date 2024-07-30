<template>
  <div class="container">
    <a-layout style="padding: 0 18px">
      <Breadcrumb
        :items="[$t('menu.automation'), $t('menu.automation.codeGenerator')]"
      />
      <a-card
        :title="$t('menu.automation.card.dataImport')"
        class="general-card"
      >
        <a-alert :type="'warning'" style="margin-bottom: 20px">
          {{ $t('automation.code-gen.tooltip.import') }}
        </a-alert>
        <a-button type="primary" style="margin-right: 10px" @click="openGetDB">
          <template #icon>
            <icon-search />
          </template>
          {{ $t('automation.code-gen.button.getDB') }}
        </a-button>
        <a-drawer
          v-model:visible="getDBDrawer"
          :footer="false"
          :width="550"
          :header="false"
        >
          <a-alert type="warning" style="margin-top: 10px">
            {{ $t('automation.code-gen.alert.getDB') }}
          </a-alert>
          <a-form :model="getDBForm" style="margin-top: 20px">
            <a-form-item
              :label="$t('automation.code-gen.form.db_name')"
              :rules="[
                {
                  required: true,
                  match: /^[a-z_]+$/,
                  lowercase: true,
                  message: $t('automation.code-gen.form.db_name.help'),
                },
              ]"
              field="table_schema"
            >
              <a-input
                v-model="getDBForm.table_schema"
                :placeholder="
                  $t('automation.code-gen.form.db_name.placeholder')
                "
              />
            </a-form-item>
          </a-form>
          <a-button
            type="primary"
            :disabled="getDBButton()"
            style="float: right; margin-bottom: 20px"
            @click="featDBTables({ ...getDBForm })"
          >
            {{ $t('automation.code-gen.button.getDB.req') }}
          </a-button>
          <a-list
            style="margin-top: 55px"
            :loading="DBTablesStatus"
            :hoverable="true"
          >
            <template #header>
              {{ $t('automation.code-gen.list.header') }}
            </template>
            <a-list-item
              v-for="(table, index) of DBTables.values()"
              :key="index"
            >
              {{ table }}
            </a-list-item>
          </a-list>
        </a-drawer>
        <a-button type="primary" @click="openImport">
          <template #icon>
            <icon-plus />
          </template>
          {{ $t('automation.code-gen.button.import') }}
        </a-button>
        <a-modal
          v-model:visible="importDrawer"
          :width="600"
          :closable="false"
          :title="$t('automation.code-gen.modal.import')"
          :on-before-ok="beforeSubmit"
          @cancel="cancelImport"
          @ok="importBusinessModel"
        >
          <a-form
            ref="formRef"
            :model="importTableForm"
            style="margin-top: 10px"
          >
            <a-form-item
              :label="$t('automation.code-gen.form.app')"
              :tooltip="$t('automation.code-gen.form.app.tooltip')"
              :rules="[
                {
                  required: true,
                  match: /^[a-z_]+$/,
                  lowercase: true,
                  message: $t('automation.code-gen.form.app.help'),
                },
              ]"
              field="app"
            >
              <a-input
                v-model="importTableForm.app"
                :placeholder="$t('automation.code-gen.form.app.placeholder')"
              />
            </a-form-item>
            <a-form-item
              :label="$t('automation.code-gen.form.db_name')"
              :tooltip="$t('automation.code-gen.form.db_name.tooltip')"
              :rules="[
                {
                  required: true,
                  match: /^[a-z_]+$/,
                  lowercase: true,
                  message: $t('automation.code-gen.form.db_name.help'),
                },
              ]"
              field="table_schema"
            >
              <a-input
                v-model="importTableForm.table_schema"
                :placeholder="
                  $t('automation.code-gen.form.db_name.placeholder')
                "
              />
            </a-form-item>
            <a-form-item
              :label="$t('automation.code-gen.form.table_name')"
              :tooltip="$t('automation.code-gen.form.table_name.tooltip')"
              :rules="[
                {
                  required: true,
                  match: /^[a-z_]+$/,
                  lowercase: true,
                  message: $t('automation.code-gen.form.table_name.help'),
                },
              ]"
              field="table_name"
            >
              <a-input
                v-model="importTableForm.table_name"
                :placeholder="
                  $t('automation.code-gen.form.table_name.placeholder')
                "
              />
            </a-form-item>
          </a-form>
        </a-modal>
      </a-card>
      <a-card
        :title="$t('menu.automation.card.codeGenerate')"
        class="general-card"
        style="margin-top: 10px"
      >
        <a-alert :type="'info'" :closable="true" style="margin-bottom: 20px">
          {{ $t('automation.code-gen.tooltip.business') }}
        </a-alert>
        <a-tooltip :content="$t('automation.code-gen.button.tooltip.business')">
          <a-button
            type="primary"
            style="margin: 0 10px 20px 0"
            @click="openBusiness"
          >
            <template #icon>
              <icon-plus />
            </template>
            {{ $t('automation.code-gen.button.business') }}
          </a-button>
        </a-tooltip>
        <a-modal
          v-model:visible="businessDrawer"
          :closable="false"
          :width="650"
          :title="$t('automation.code-gen.modal.business')"
          :on-before-ok="beforeSubmit"
          @ok="submitNewOrEditBusiness"
          @cancel="cancelBusiness"
        >
          <a-form ref="formRef" :model="createBusinessForm">
            <a-form-item
              :label="$t('automation.code-gen.form.app_name')"
              :tooltip="$t('automation.code-gen.form.app_name.tooltip')"
              :rules="[
                {
                  required: true,
                  message: $t('automation.code-gen.form.app_name.help'),
                },
              ]"
              field="app_name"
            >
              <a-input
                v-model="createBusinessForm.app_name"
                :placeholder="
                  $t('automation.code-gen.form.app_name.placeholder')
                "
              />
            </a-form-item>
            <a-form-item
              :label="$t('automation.code-gen.form.table_name_en')"
              :rules="[
                {
                  required: true,
                  message: $t('automation.code-gen.form.table_name_en.help'),
                },
              ]"
              field="table_name_en"
            >
              <a-input
                v-model="createBusinessForm.table_name_en"
                :placeholder="
                  $t('automation.code-gen.form.table_name_en.placeholder')
                "
              />
            </a-form-item>
            <a-form-item
              :label="$t('automation.code-gen.form.table_name_zh')"
              :rules="[
                {
                  required: true,
                  match: /^[\u4e00-\u9fa5]+$/,
                  message: $t('automation.code-gen.form.table_name_zh.help'),
                },
              ]"
              field="table_name_zh"
            >
              <a-input
                v-model="createBusinessForm.table_name_zh"
                :placeholder="
                  $t('automation.code-gen.form.table_name_zh.placeholder')
                "
              />
            </a-form-item>
            <a-form-item
              :label="$t('automation.code-gen.form.table_simple_name_zh')"
              :rules="[
                {
                  required: true,
                  match: /^[\u4e00-\u9fa5]+$/,
                  message: $t(
                    'automation.code-gen.form.table_simple_name_zh.help'
                  ),
                },
              ]"
              field="table_simple_name_zh"
            >
              <a-input
                v-model="createBusinessForm.table_simple_name_zh"
                :placeholder="
                  $t(
                    'automation.code-gen.form.table_simple_name_zh.placeholder'
                  )
                "
              />
            </a-form-item>
            <a-form-item
              :label="$t('automation.code-gen.form.table_comment')"
              field="table_comment"
            >
              <a-input
                v-model="createBusinessForm.table_comment"
                :placeholder="
                  $t('automation.code-gen.form.table_comment.placeholder')
                "
              />
            </a-form-item>
            <a-form-item
              :label="$t('automation.code-gen.form.schema_name')"
              :tooltip="$t('automation.code-gen.form.schema_name.tooltip')"
              field="schema_name"
            >
              <a-input
                v-model="createBusinessForm.schema_name"
                :placeholder="
                  $t('automation.code-gen.form.schema_name.placeholder')
                "
              />
            </a-form-item>
            <a-form-item
              :label="$t('automation.code-gen.form.default_datetime_column')"
              :tooltip="
                $t('automation.code-gen.form.default_datetime_column.tooltip')
              "
              :required="true"
              field="default_datetime_column"
            >
              <a-switch v-model="createBusinessForm.default_datetime_column">
                <template #checked>
                  {{ $t('switch.open') }}
                </template>
                <template #unchecked>
                  {{ $t('switch.close') }}
                </template>
              </a-switch>
            </a-form-item>
            <a-form-item
              :label="$t('automation.code-gen.form.api_version')"
              :tooltip="$t('automation.code-gen.form.api_version.tooltip')"
              :rules="[
                {
                  required: true,
                  message: $t('automation.code-gen.form.api_version.help'),
                },
              ]"
              field="api_version"
            >
              <a-input
                v-model="createBusinessForm.api_version"
                :placeholder="
                  $t('automation.code-gen.form.api_version.placeholder')
                "
              />
            </a-form-item>
            <a-form-item
              :label="$t('automation.code-gen.form.gen_path')"
              :tooltip="$t('automation.code-gen.form.gen_path.tooltip')"
              field="gen_path"
            >
              <a-input
                v-model="createBusinessForm.gen_path"
                :placeholder="
                  $t('automation.code-gen.form.gen_path.placeholder')
                "
              />
            </a-form-item>
            <a-form-item
              :label="$t('automation.code-gen.form.remark')"
              field="remark"
            >
              <a-textarea
                v-model="createBusinessForm.remark"
                :placeholder="$t('automation.code-gen.form.remark.placeholder')"
              />
            </a-form-item>
          </a-form>
        </a-modal>
        <a-select
          v-model="selectBusiness"
          :allow-search="false"
          style="width: 250px"
          :placeholder="$t('automation.code-gen.select.business')"
        />
        <a-table :columns="businessColumns" />
        <a-alert :type="'info'" :closable="true" style="margin-top: 20px">
          {{ $t('automation.code-gen.tooltip.model') }}
        </a-alert>
        <a-button
          type="primary"
          style="margin: 20px 0 20px"
          :disabled="createModelStatus()"
          @click="openModel"
        >
          <template #icon>
            <icon-plus />
          </template>
          {{ $t('automation.code-gen.button.model') }}
        </a-button>
        <a-modal
          v-model:visible="modelDrawer"
          :width="600"
          :closable="false"
          :title="$t('automation.code-gen.modal.model')"
          @ok="okModel"
          @cancel="cancelModel"
        >
          <a-form>
            <a-form-item
              :label="$t('automation.code-gen.form.name')"
              :required="true"
            >
              <a-input
                :placeholder="$t('automation.code-gen.form.name.placeholder')"
              />
            </a-form-item>
            <a-form-item :label="$t('automation.code-gen.form.comment')">
              <a-input
                :placeholder="
                  $t('automation.code-gen.form.comment.placeholder')
                "
              />
            </a-form-item>
            <a-form-item
              :label="$t('automation.code-gen.form.type')"
              :required="true"
            >
              <a-select
                v-model="selectSQLAType"
                :field-names="SQLATypeFN"
                :options="SQLATypeOptions"
                :placeholder="$t('automation.code-gen.form.type.placeholder')"
              />
            </a-form-item>
            <a-form-item :label="$t('automation.code-gen.form.default')">
              <a-input
                :placeholder="
                  $t('automation.code-gen.form.default.placeholder')
                "
              />
            </a-form-item>
            <a-form-item
              :label="$t('automation.code-gen.form.sort')"
              :required="true"
            >
              <a-input
                :placeholder="$t('automation.code-gen.form.sort.placeholder')"
              />
            </a-form-item>
            <a-form-item
              v-if="selectSQLAType == 'VARCHAR'"
              :label="$t('automation.code-gen.form.length')"
              :required="true"
            >
              <a-input
                :placeholder="$t('automation.code-gen.form.length.placeholder')"
              />
            </a-form-item>
            <a-form-item
              :label="$t('automation.code-gen.form.is_pk')"
              :tooltip="$t('automation.code-gen.form.is_pk.tooltip')"
              :required="true"
            >
              <a-switch>
                <template #checked>
                  {{ $t('switch.open') }}
                </template>
                <template #unchecked>
                  {{ $t('switch.close') }}
                </template>
              </a-switch>
            </a-form-item>
            <a-form-item
              :label="$t('automation.code-gen.form.is_nullable')"
              :required="true"
            >
              <a-switch>
                <template #checked>
                  {{ $t('switch.open') }}
                </template>
                <template #unchecked>
                  {{ $t('switch.close') }}
                </template>
              </a-switch>
            </a-form-item>
            <a-form-item
              :label="$t('automation.code-gen.form.gen_business_id')"
              :required="true"
            >
              <a-select
                :placeholder="
                  $t('automation.code-gen.form.gen_business_id.placeholder')
                "
              />
            </a-form-item>
          </a-form>
        </a-modal>
        <a-table :columns="modelColumns" />
        <a-space style="margin: 20px 0 20px; float: right">
          <template #split>
            <a-divider direction="vertical" />
          </template>
          <a-button type="primary" @click="openPreviewDrawer">
            <template #icon>
              <icon-eye />
            </template>
            {{ $t('automation.code-gen.button.preview') }}
          </a-button>
          <a-button type="primary">
            <template #icon>
              <icon-import />
            </template>
            {{ $t('automation.code-gen.button.write') }}
          </a-button>
          <a-button type="primary">
            <template #icon>
              <icon-download />
            </template>
            {{ $t('automation.code-gen.button.download') }}
          </a-button>
        </a-space>
        <a-drawer
          v-model:visible="previewDrawer"
          :footer="false"
          :width="888"
          :header="false"
        >
          <a-tabs :animation="true" :justify="true">
            <a-tab-pane key="api" title="api.py">
              <Codemirror v-model:value="code" :options="cmOptions" />
            </a-tab-pane>
            <a-tab-pane key="crud" title="crud.py">
              <Codemirror v-model:value="code" :options="cmOptions" />
            </a-tab-pane>
            <a-tab-pane key="model" title="model.py">
              <Codemirror v-model:value="code" :options="cmOptions" />
            </a-tab-pane>
            <a-tab-pane key="schema" title="schema.py">
              <Codemirror v-model:value="code" :options="cmOptions" />
            </a-tab-pane>
            <a-tab-pane key="service" title="service.py">
              <Codemirror v-model:value="code" :options="cmOptions" />
            </a-tab-pane>
          </a-tabs>
        </a-drawer>
      </a-card>
    </a-layout>
  </div>
  <div class="footer">
    <Footer />
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import { computed, reactive, ref, watch } from 'vue';
  import { Message, TableColumnData } from '@arco-design/web-vue';
  import { EditorConfiguration } from 'codemirror';
  import Codemirror from 'codemirror-editor-vue3';
  import useLoading from '@/hooks/loading';
  import Footer from '@/components/footer/index.vue';
  // eslint-disable-next-line import/extensions
  import 'codemirror/mode/python/python.js';
  import 'codemirror/theme/dracula.css';
  import 'codemirror/addon/display/autorefresh';
  import {
    BusinessReq,
    BusinessRes,
    createBusiness,
    DBTableParams,
    ImportReq,
    importTable,
    queryBusinessDetail,
    queryDBTables,
  } from '@/api/automatiion';
  import { AnyObject } from '@/types/global';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(false);
  const cmOptions: EditorConfiguration = reactive({
    mode: 'text/x-python',
    theme: 'dracula',
    readOnly: true,
    lineNumbers: true,
    gutters: ['CodeMirror-lint-markers'],
    lint: true,
    autoRefresh: true,
  });
  const code = ref<string>('data');
  const formRef = ref();
  const selectSQLAType = ref<string>('');
  const SQLATypeFN = { value: 'type', label: 'type' };
  const SQLATypeOptions = reactive([
    { type: 'BIGINT' },
    { type: 'BINARY' },
    { type: 'BIT' },
    { type: 'BLOB' },
    { type: 'BOOL' },
    { type: 'BOOLEAN' },
    { type: 'CHAR' },
    { type: 'DATE' },
    { type: 'DATETIME' },
    { type: 'DECIMAL' },
    { type: 'DOUBLE' },
    { type: 'DOUBLE PRECISION' },
    { type: 'ENUM' },
    { type: 'FLOAT' },
    { type: 'GEOMETRY' },
    { type: 'GEOMETRYCOLLECTION' },
    { type: 'INT' },
    { type: 'INTEGER' },
    { type: 'JSON' },
    { type: 'LINESTRING' },
    { type: 'LONGBLOB' },
    { type: 'LONGTEXT' },
    { type: 'MEDIUMBLOB' },
    { type: 'MEDIUMINT' },
    { type: 'MEDIUMTEXT' },
    { type: 'MULTILINESTRING' },
    { type: 'MULTIPOINT' },
    { type: 'MULTIPOLYGON' },
    { type: 'NUMERIC' },
    { type: 'POINT' },
    { type: 'POLYGON' },
    { type: 'REAL' },
    { type: 'SERIAL' },
    { type: 'SET' },
    { type: 'SMALLINT' },
    { type: 'TEXT' },
    { type: 'TIME' },
    { type: 'TIMESTAMP' },
    { type: 'TINYBLOB' },
    { type: 'TINYINT' },
    { type: 'TINYTEXT' },
    { type: 'VARBINARY' },
    { type: 'VARCHAR' },
    { type: 'YEAR' },
  ]);
  const getDBDrawer = ref<boolean>(false);
  const importDrawer = ref<boolean>(false);
  const businessDrawer = ref<boolean>(false);
  const modelDrawer = ref<boolean>(false);
  const previewDrawer = ref<boolean>(false);
  const openGetDB = () => {
    getDBDrawer.value = true;
  };
  const openImport = () => {
    resetForm(importTableForm, importData);
    importDrawer.value = true;
  };
  const cancelImport = () => {
    importDrawer.value = false;
  };
  const openBusiness = () => {
    resetForm(createBusinessForm, createBusinessData);
    businessDrawer.value = true;
    buttonStatus.value = 'newBusiness';
  };
  const cancelBusiness = () => {
    businessDrawer.value = false;
  };
  const openModel = () => {
    modelDrawer.value = true;
  };
  const cancelModel = () => {
    modelDrawer.value = false;
  };
  const okModel = () => {
    modelDrawer.value = false;
  };
  const openPreviewDrawer = () => {
    previewDrawer.value = true;
  };

  const businessColumns = computed<TableColumnData[]>(() => [
    {
      title: t('automation.code-gen.columns.app_name'),
      dataIndex: '',
      slotName: '',
    },
    {
      title: t('automation.code-gen.columns.table_name_en'),
      dataIndex: '',
      slotName: '',
    },
    {
      title: t('automation.code-gen.columns.table_name_zh'),
      dataIndex: '',
      slotName: '',
    },
    {
      title: t('automation.code-gen.columns.table_simple_name_zh'),
      dataIndex: '',
      slotName: '',
    },
    {
      title: t('automation.code-gen.columns.table_comment'),
      dataIndex: '',
      slotName: '',
    },
    {
      title: t('automation.code-gen.columns.schema_name'),
      dataIndex: '',
      slotName: '',
    },
    {
      title: t('automation.code-gen.columns.default_datetime_column'),
      dataIndex: '',
      slotName: '',
    },
    {
      title: t('automation.code-gen.columns.api_version'),
      dataIndex: '',
      slotName: '',
    },
    {
      title: t('automation.code-gen.columns.gen_path'),
      dataIndex: '',
      slotName: '',
    },
    {
      title: t('automation.code-gen.columns.remark'),
      dataIndex: '',
      slotName: '',
    },
    {
      title: t('automation.code-gen.columns.operate'),
      dataIndex: 'operate',
      slotName: 'operate',
    },
  ]);
  const modelColumns = computed<TableColumnData[]>(() => [
    {
      title: 'ID',
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: t('automation.code-gen.columns.name'),
      dataIndex: '',
      slotName: '',
    },
    {
      title: t('automation.code-gen.columns.comment'),
      dataIndex: '',
      slotName: '',
    },
    {
      title: t('automation.code-gen.columns.type'),
      dataIndex: '',
      slotName: '',
    },
    {
      title: t('automation.code-gen.columns.pd_type'),
      dataIndex: '',
      slotName: '',
    },
    {
      title: t('automation.code-gen.columns.default'),
      dataIndex: '',
      slotName: '',
    },
    {
      title: t('automation.code-gen.columns.sort'),
      dataIndex: '',
      slotName: '',
    },
    {
      title: t('automation.code-gen.columns.length'),
      dataIndex: '',
      slotName: '',
    },
    {
      title: t('automation.code-gen.columns.is_pk'),
      dataIndex: '',
      slotName: '',
    },
    {
      title: t('automation.code-gen.columns.is_nullable'),
      dataIndex: '',
      slotName: '',
    },
    {
      title: t('automation.code-gen.columns.gen_business_id'),
      dataIndex: '',
      slotName: '',
    },
    {
      title: t('automation.code-gen.columns.operate'),
      dataIndex: 'operate',
      slotName: 'operate',
    },
  ]);
  const getDBForm = reactive<DBTableParams>({ table_schema: '' });
  const getDBButton = () => {
    return !getDBForm.table_schema;
  };
  const DBTables = ref<string[]>([]);
  const DBTablesStatus = ref<boolean>(false);

  // 请求数据库表
  const featDBTables = async (params: DBTableParams) => {
    DBTablesStatus.value = true;
    try {
      DBTables.value = await queryDBTables(params);
    } catch (error) {
      // console.log(error);
    } finally {
      DBTablesStatus.value = false;
    }
  };

  const selectBusiness = ref<string>('');
  const createModelStatus = () => {
    return !selectBusiness.value;
  };

  const importData: ImportReq = {
    app: '',
    table_name: '',
    table_schema: '',
  };
  const importTableForm = reactive<ImportReq>({ ...importData });

  // 导入
  const importBusinessModel = async () => {
    try {
      await importTable(importTableForm);
      Message.success(t('submit.create.success'));
      importDrawer.value = false;
    } catch (error) {
      // console.log(error);
    }
  };

  const createBusinessData: BusinessReq = {
    app_name: '',
    table_name_en: '',
    table_name_zh: '',
    table_simple_name_zh: '',
    table_comment: undefined,
    schema_name: undefined,
    default_datetime_column: true,
    api_version: '',
    gen_path: undefined,
    remark: undefined,
  };
  const createBusinessForm = reactive<BusinessReq>({ ...createBusinessData });
  const currentBusiness = ref<number>(0);

  // 提交业务
  const buttonStatus = ref<string>();
  const submitNewOrEditBusiness = async () => {
    try {
      if (buttonStatus.value === 'newBusiness') {
        await createBusiness(createBusinessForm);
        cancelBusiness();
        Message.success(t('submit.create.success'));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBusinessList = async (pk: number) => {
    setLoading(true);
    try {
      const res = await queryBusinessDetail(pk);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 表单校验
  const beforeSubmit = async (done: any) => {
    const res = await formRef.value?.validate();
    if (!res) {
      // 关闭对话框
      done(true);
    }
    done(false);
  };

  // 重置表单
  const resetForm = (input: AnyObject, data: Record<any, any>) => {
    Object.keys(data).forEach((key) => {
      // @ts-ignore
      input[key] = data[key];
    });
  };

  // 监控
  watch(getDBDrawer, (newVal) => {
    if (newVal) {
      getDBForm.table_schema = '';
      DBTables.value = [];
    }
  });
</script>

<style scoped lang="less"></style>
