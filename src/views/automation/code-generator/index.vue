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
        <a-alert :type="'warning'">
          {{ $t('automation.code-gen.tooltip.pcd') }}
        </a-alert>
        <a-alert
          :type="'info'"
          :show-icon="false"
          :closable="true"
          style="margin: 20px 0 20px"
        >
          {{ $t('automation.code-gen.tooltip.business') }}
          <br />
          {{ $t('automation.code-gen.tooltip.model') }}
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
              field="default_datetime_column"
            >
              <a-switch v-model="switchStatus">
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
          :default-active-first-option="false"
          :allow-search="false"
          :loading="BusinessListStatus"
          style="width: 250px"
          :placeholder="$t('automation.code-gen.select.business')"
          :options="BusinessList"
          :field-names="BusinessFN"
          @popup-visible-change="fetchBusinessList"
        />
        <a-table
          :size="'medium'"
          :columns="businessColumns"
          :data="businessData"
          row-key="id"
          :pagination="false"
        >
          <template #default_datetime_column="{ record }">
            <a-badge
              v-if="record.default_datetime_column === 1"
              :status="'success'"
            />
            <a-badge v-else :status="'danger'" />
          </template>
          <template #operate="{ record }">
            <a-space>
              <a-link @click="EditBusiness(record.id)">
                {{ $t(`admin.menu.columns.edit`) }}
              </a-link>
              <a-link :status="'danger'" @click="DeleteBusiness(record.id)">
                {{ $t(`admin.menu.columns.delete`) }}
              </a-link>
            </a-space>
          </template>
        </a-table>
        <a-button
          type="primary"
          style="margin: 20px 0 20px"
          :disabled="selectBusinessStatus()"
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
          :on-before-ok="beforeSubmit"
          @ok="submitNewOrEditModel"
          @cancel="cancelModel"
        >
          <a-form ref="formRef" :model="createModelForm">
            <a-form-item
              :label="$t('automation.code-gen.form.name')"
              :rules="[
                {
                  required: true,
                  message: $t('automation.code-gen.form.name.help'),
                },
              ]"
              field="name"
            >
              <a-input
                v-model="createModelForm.name"
                :placeholder="$t('automation.code-gen.form.name.placeholder')"
              />
            </a-form-item>
            <a-form-item :label="$t('automation.code-gen.form.comment')">
              <a-input
                v-model="createModelForm.comment"
                :placeholder="
                  $t('automation.code-gen.form.comment.placeholder')
                "
                field="comment"
              />
            </a-form-item>
            <a-form-item
              :label="$t('automation.code-gen.form.type')"
              :rules="[
                {
                  required: true,
                  message: $t('automation.code-gen.form.type.help'),
                },
              ]"
              field="type"
            >
              <a-select
                v-model="createModelForm.type"
                :field-names="SQLATypeFN"
                :options="SQLATypeOptions"
                :placeholder="$t('automation.code-gen.form.type.placeholder')"
              />
            </a-form-item>
            <a-form-item :label="$t('automation.code-gen.form.default')">
              <a-input
                v-model="createModelForm.default"
                :placeholder="
                  $t('automation.code-gen.form.default.placeholder')
                "
                field="default"
              />
            </a-form-item>
            <a-form-item
              :label="$t('automation.code-gen.form.sort')"
              :rules="[
                {
                  required: true,
                  message: $t('automation.code-gen.form.sort.help'),
                },
              ]"
              field="sort"
            >
              <a-input-number
                v-model="createModelForm.sort"
                :placeholder="$t('automation.code-gen.form.sort.placeholder')"
              />
            </a-form-item>
            <a-form-item
              v-if="createModelForm.type == 'VARCHAR'"
              :label="$t('automation.code-gen.form.length')"
              :rules="[
                {
                  required: true,
                  message: $t('automation.code-gen.form.length.help'),
                },
              ]"
              field="length"
            >
              <a-input-number
                v-model="createModelForm.length"
                :placeholder="$t('automation.code-gen.form.length.placeholder')"
              />
            </a-form-item>
            <a-form-item
              :label="$t('automation.code-gen.form.is_pk')"
              :tooltip="$t('automation.code-gen.form.is_pk.tooltip')"
              field="is_pk"
            >
              <a-switch v-model="switchPkStatus">
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
              field="is_nullable"
            >
              <a-switch v-model="switchNullableStatus">
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
              field="gen_business_id"
              :rules="[
                {
                  required: true,
                  message: $t('automation.code-gen.form.gen_business_id.help'),
                },
              ]"
            >
              <a-select
                v-model="selectBusiness"
                :placeholder="
                  $t('automation.code-gen.form.gen_business_id.placeholder')
                "
                :options="BusinessList"
                :field-names="BusinessFN"
                :disabled="true"
              />
            </a-form-item>
          </a-form>
        </a-modal>
        <a-table
          :size="'medium'"
          :columns="modelColumns"
          :data="modelData"
          :loading="loading"
          row-key="id"
          :pagination="false"
        >
          <template #index="{ rowIndex }">
            {{ rowIndex + 1 }}
          </template>
          <template #is_pk="{ record }">
            <a-badge v-if="record.is_pk === 1" :status="'success'" />
            <a-badge v-else :status="'danger'" />
          </template>
          <template #is_nullable="{ record }">
            <a-badge v-if="record.is_nullable === 1" :status="'success'" />
            <a-badge v-else :status="'danger'" />
          </template>
          <template #operate="{ record }">
            <a-space>
              <a-link @click="EditModel(record.id)">
                {{ $t(`admin.menu.columns.edit`) }}
              </a-link>
              <a-link :status="'danger'" @click="DeleteModel(record.id)">
                {{ $t(`admin.menu.columns.delete`) }}
              </a-link>
            </a-space>
          </template>
        </a-table>
        <a-space style="margin: 20px 0 20px; float: right">
          <template #split>
            <a-divider direction="vertical" />
          </template>
          <a-button
            type="primary"
            :disabled="selectBusinessStatus()"
            @click="openPreviewDrawer"
          >
            <template #icon>
              <icon-eye />
            </template>
            {{ $t('automation.code-gen.button.preview') }}
          </a-button>
          <a-button type="primary" :disabled="selectBusinessStatus()">
            <template #icon>
              <icon-import />
            </template>
            {{ $t('automation.code-gen.button.write') }}
          </a-button>
          <a-button type="primary" :disabled="selectBusinessStatus()">
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
          <a-tabs
            v-model:active-key="previewCodeTab"
            :animation="true"
            :justify="true"
          >
            <a-tooltip
              :mini="true"
              :position="'left'"
              :content="$t('automation.code-gen.tooltip.code.copy')"
            >
              <a-button class="copy-button" @click="copyCode">
                <template #icon><icon-copy /></template>
              </a-button>
            </a-tooltip>
            <a-tab-pane key="api" title="api.py">
              <Codemirror v-model:value="apiCode" :options="cmOptions" />
            </a-tab-pane>
            <a-tab-pane key="crud" title="crud.py">
              <Codemirror v-model:value="crudCode" :options="cmOptions" />
            </a-tab-pane>
            <a-tab-pane key="model" title="model.py">
              <Codemirror v-model:value="modelCode" :options="cmOptions" />
            </a-tab-pane>
            <a-tab-pane key="schema" title="schema.py">
              <Codemirror v-model:value="schemaCode" :options="cmOptions" />
            </a-tab-pane>
            <a-tab-pane key="service" title="service.py">
              <Codemirror v-model:value="serviceCode" :options="cmOptions" />
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
  import { useClipboard } from '@vueuse/core';
  import useLoading from '@/hooks/loading';
  import Footer from '@/components/footer/index.vue';
  // eslint-disable-next-line import/extensions
  import 'codemirror/mode/python/python.js';
  import 'codemirror/theme/monokai.css';
  import 'codemirror/addon/display/autorefresh';
  import {
    BusinessDetailRes,
    BusinessReq,
    createBusiness,
    createModel,
    DBTableParams,
    ImportReq,
    importTable,
    ModelReq,
    previewCode,
    queryBusinessAll,
    queryBusinessDetail,
    queryBusinessModels,
    queryDBTables,
  } from '@/api/automatiion';
  import { AnyObject } from '@/types/global';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(false);
  const cmOptions: EditorConfiguration = reactive({
    mode: 'text/x-python',
    theme: 'monokai',
    readOnly: true,
    lineNumbers: true,
    autoRefresh: true,
    smartIndent: false,
    tabSize: 4,
    indentUnit: 4,
  });
  const apiCode = ref<string>();
  const crudCode = ref<string>();
  const modelCode = ref<string>();
  const schemaCode = ref<string>();
  const serviceCode = ref<string>();
  const formRef = ref();
  const SQLATypeFN = { value: 'type', label: 'type' };
  const BusinessFN = { value: 'id', label: 'table_name_zh' };
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
    resetForm(createModelForm, createModelData);
    modelDrawer.value = true;
    buttonStatus.value = 'newModel';
  };
  const cancelModel = () => {
    modelDrawer.value = false;
  };
  const openPreviewDrawer = () => {
    previewDrawer.value = true;
    fetchPreviewCode();
  };
  const businessColumns = computed<TableColumnData[]>(() => [
    {
      title: t('automation.code-gen.columns.app_name'),
      dataIndex: 'app_name',
      slotName: 'app_name',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: t('automation.code-gen.columns.table_name_en'),
      dataIndex: 'table_name_en',
      slotName: 'table_name_en',
      ellipsis: true,
      tooltip: true,
      width: 130,
    },
    {
      title: t('automation.code-gen.columns.table_name_zh'),
      dataIndex: 'table_name_zh',
      slotName: 'table_name_zh',
      ellipsis: true,
      tooltip: true,
      width: 150,
    },
    {
      title: t('automation.code-gen.columns.table_simple_name_zh'),
      dataIndex: 'table_simple_name_zh',
      slotName: 'table_simple_name_zh',
      width: 150,
    },
    {
      title: t('automation.code-gen.columns.table_comment'),
      dataIndex: 'table_comment',
      slotName: 'table_comment',
      ellipsis: true,
      tooltip: true,
      width: 180,
    },
    {
      title: t('automation.code-gen.columns.schema_name'),
      dataIndex: 'schema_name',
      slotName: 'schema_name',
      width: 150,
    },
    {
      title: t('automation.code-gen.columns.default_datetime_column'),
      dataIndex: 'default_datetime_column',
      slotName: 'default_datetime_column',
      align: 'center',
      width: 120,
    },
    {
      title: t('automation.code-gen.columns.api_version'),
      dataIndex: 'api_version',
      slotName: 'api_version',
      align: 'center',
      width: 100,
    },
    {
      title: t('automation.code-gen.columns.gen_path'),
      dataIndex: 'gen_path',
      slotName: 'gen_path',
      ellipsis: true,
      tooltip: true,
      width: 250,
    },
    {
      title: t('automation.code-gen.columns.remark'),
      dataIndex: 'remark',
      slotName: 'remark',
      ellipsis: true,
      tooltip: true,
      width: 150,
    },
    {
      title: t('automation.code-gen.columns.operate'),
      dataIndex: 'operate',
      slotName: 'operate',
      align: 'center',
      width: 200,
    },
  ]);
  const modelColumns = computed<TableColumnData[]>(() => [
    {
      title: 'ID',
      dataIndex: 'index',
      slotName: 'index',
      ellipsis: true,
      tooltip: true,
      width: 50,
    },
    {
      title: t('automation.code-gen.columns.name'),
      dataIndex: 'name',
      slotName: 'name',
      ellipsis: true,
      tooltip: true,
      width: 180,
    },
    {
      title: t('automation.code-gen.columns.comment'),
      dataIndex: 'comment',
      slotName: 'comment',
      ellipsis: true,
      tooltip: true,
      width: 180,
    },
    {
      title: t('automation.code-gen.columns.type'),
      dataIndex: 'type',
      slotName: 'type',
      width: 120,
    },
    {
      title: t('automation.code-gen.columns.pd_type'),
      dataIndex: 'pd_type',
      slotName: 'pd_type',
      align: 'center',
      width: 140,
    },
    {
      title: t('automation.code-gen.columns.default'),
      dataIndex: 'default',
      slotName: 'default',
      ellipsis: true,
      tooltip: true,
      width: 250,
    },
    {
      title: t('automation.code-gen.columns.sort'),
      dataIndex: 'sort',
      slotName: 'sort',
      align: 'center',
      width: 100,
    },
    {
      title: t('automation.code-gen.columns.length'),
      dataIndex: 'length',
      slotName: 'length',
      align: 'center',
      width: 100,
    },
    {
      title: t('automation.code-gen.columns.is_pk'),
      dataIndex: 'is_pk',
      slotName: 'is_pk',
      align: 'center',
      width: 80,
    },
    {
      title: t('automation.code-gen.columns.is_nullable'),
      dataIndex: 'is_nullable',
      slotName: 'is_nullable',
      align: 'center',
      width: 80,
    },
    {
      title: t('automation.code-gen.columns.operate'),
      dataIndex: 'operate',
      slotName: 'operate',
      align: 'center',
      width: 220,
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

  const selectBusiness = ref(); // type: number
  const selectBusinessStatus = () => {
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
      // console.log(error);
    }
  };

  const createModelData: ModelReq = {
    name: '',
    comment: undefined,
    type: '',
    default: undefined,
    sort: 0,
    length: 0,
    is_pk: false,
    is_nullable: false,
    gen_business_id: undefined,
  };
  const createModelForm = reactive<ModelReq>({ ...createModelData });

  // 提交模型
  const submitNewOrEditModel = async () => {
    try {
      if (buttonStatus.value === 'newModel') {
        createModelForm.gen_business_id = selectBusiness.value;
        await createModel(createModelForm);
        cancelModel();
        Message.success(t('submit.create.success'));
        await fetchModelList();
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const BusinessList = ref<BusinessDetailRes[]>([]);
  const BusinessListStatus = ref<boolean>(false);
  // 请求业务列表
  const fetchBusinessList = async () => {
    BusinessListStatus.value = true;
    try {
      BusinessList.value = await queryBusinessAll();
    } catch (error) {
      // console.log(error);
    } finally {
      BusinessListStatus.value = false;
    }
  };

  // 请求模型列表
  const fetchModelList = async () => {
    setLoading(true);
    try {
      modelData.value = await queryBusinessModels(selectBusiness.value);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const businessData = ref<BusinessDetailRes[]>([]);
  const modelData = ref<ModelReq[]>([]);
  // 请求业务详情
  const fetchBusinessDetail = async (pk: number) => {
    setLoading(true);
    try {
      const res = await queryBusinessDetail(pk);
      modelData.value = res.gen_model || [];
      delete res.gen_model;
      businessData.value = [res];
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const EditBusiness = ref();
  const DeleteBusiness = ref();
  const EditModel = ref();
  const DeleteModel = ref();

  // 请求代码预览
  const fetchPreviewCode = async () => {
    try {
      const res = await previewCode(selectBusiness.value);
      apiCode.value = res['py/api.py'];
      crudCode.value = res['py/crud.py'];
      modelCode.value = res['py/model.py'];
      schemaCode.value = res['py/schema.py'];
      serviceCode.value = res['py/service.py'];
    } catch (error) {
      // console.log(error);
    }
  };

  const previewCodeTab = ref<string>('api');
  const copyCodeButton = (): string => {
    const codeMap = {
      api: apiCode.value,
      crud: crudCode.value,
      model: modelCode.value,
      schema: schemaCode.value,
      service: serviceCode.value,
    };
    return codeMap[previewCodeTab.value];
  };

  // 复制代码
  const copyCode = () => {
    const { copy, copied } = useClipboard();
    copy(copyCodeButton());
    if (copied) {
      Message.success(t('copy.success'));
    } else {
      Message.error(t('copy.error'));
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

  watch(selectBusiness, (newVal, oldVal) => {
    createModelForm.gen_business_id = newVal;
    if (newVal !== oldVal) {
      fetchBusinessDetail(newVal);
    }
  });

  const switchStatus = ref<boolean>(true);
  const switchPkStatus = ref<boolean>(false);
  const switchNullableStatus = ref<boolean>(false);
  watch(switchStatus, (newVal) => {
    createBusinessForm.default_datetime_column = newVal;
  });
  watch(switchPkStatus, (newVal) => {
    createModelForm.is_pk = newVal;
  });
  watch(switchNullableStatus, (newVal) => {
    createModelForm.is_nullable = newVal;
  });
</script>

<style scoped lang="less">
  .copy-button {
    position: absolute;
    z-index: 1;
    top: 68px;
    right: 10px;
    opacity: 0.5;
    transition: opacity 0.5s;

    &:hover {
      opacity: 1;
    }
  }
</style>
