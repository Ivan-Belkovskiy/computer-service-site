"use client";

import { useState, useTransition, useOptimistic, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  createLegalDocument,
  updateLegalDocument,
  deleteLegalDocument,
  reorderLegalDocuments,
} from "@/app/actions/legal-documents";
import styles from "./LegalDocumentManager.module.css";

type LegalUrlType = "PAGE" | "EXTERNAL";

type LegalDocument = {
  id: number;
  slug: string;
  title: string;
  url: string;
  url_type: LegalUrlType;
  display_order: number;
  is_active: boolean;
  show_in_footer: boolean;
  show_in_modal: boolean;
};

type PageOption = { slug: string; name: string };

type DocumentDraft = {
  slug: string;
  title: string;
  url: string;
  url_type: LegalUrlType;
  show_in_footer: boolean;
  show_in_modal: boolean;
};

type OptimisticAction =
  | {
    type: "toggle";
    id: number;
    field: "is_active" | "show_in_footer" | "show_in_modal";
  }
  | { type: "reorder"; orderedIds: number[] }
  | { type: "delete"; id: number };

const emptyDocument: DocumentDraft = {
  slug: "",
  title: "",
  url: "",
  url_type: "PAGE",
  show_in_footer: true,
  show_in_modal: false,
};

function sortDocuments(docs: LegalDocument[]): LegalDocument[] {
  return [...docs].sort(
    (a, b) => a.display_order - b.display_order || a.id - b.id,
  );
}

function optimisticReducer(
  state: LegalDocument[],
  action: OptimisticAction,
): LegalDocument[] {
  switch (action.type) {
    case "toggle":
      return state.map((d) =>
        d.id === action.id ? { ...d, [action.field]: !d[action.field] } : d,
      );
    case "reorder": {
      const map = new Map(state.map((d) => [d.id, d]));
      return action.orderedIds
        .map((id, index) => {
          const doc = map.get(id);
          return doc ? { ...doc, display_order: index } : null;
        })
        .filter((d): d is LegalDocument => d !== null);
    }
    case "delete":
      return state.filter((d) => d.id !== action.id);
    default:
      return state;
  }
}

export function LegalDocumentsManager({
  initialDocuments,
  allPages,
}: {
  initialDocuments: LegalDocument[];
  allPages: PageOption[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newDoc, setNewDoc] = useState<DocumentDraft>(emptyDocument);

  const sorted = useMemo(
    () => sortDocuments(initialDocuments),
    [initialDocuments],
  );

  const [documents, applyOptimistic] = useOptimistic(sorted, optimisticReducer);

  const openAddPanel = () => {
    setNewDoc(emptyDocument);
    setError(null);
    setShowAdd(true);
  };

  const closeAddPanel = () => {
    setNewDoc(emptyDocument);
    setError(null);
    setShowAdd(false);
  };

  const handleCreate = () => {
    setError(null);
    startTransition(async () => {
      const res = await createLegalDocument({ ...newDoc, is_active: true });
      if (res.error) {
        setError(res.error);
      } else {
        setNewDoc(emptyDocument);
        setShowAdd(false);
        router.refresh();
      }
    });
  };

  const handleDelete = (doc: LegalDocument) => {
    if (!confirm(`Удалить документ «${doc.title}»?`)) return;
    setError(null);
    startTransition(async () => {
      applyOptimistic({ type: "delete", id: doc.id });
      const res = await deleteLegalDocument(doc.id);
      if (res.error) setError(res.error);
      router.refresh();
    });
  };

  const handleToggle = (
    doc: LegalDocument,
    field: "is_active" | "show_in_footer" | "show_in_modal",
  ) => {
    setError(null);
    startTransition(async () => {
      applyOptimistic({ type: "toggle", id: doc.id, field });
      const res = await updateLegalDocument(doc.id, { [field]: !doc[field] });
      if (res.error) setError(res.error);
      router.refresh();
    });
  };

  const handleMove = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= documents.length) return;
    const arr = [...documents];
    [arr[index], arr[target]] = [arr[target], arr[index]];
    const orderedIds = arr.map((d) => d.id);

    setError(null);
    startTransition(async () => {
      applyOptimistic({ type: "reorder", orderedIds });
      const res = await reorderLegalDocuments(orderedIds);
      if (res.error) setError(res.error);
      router.refresh();
    });
  };

  return (
    <fieldset className={styles.wrapper}>
      <legend>Правовые документы</legend>

      {error && <div className={styles.error}>{error}</div>}

      {documents.length === 0 && (
        <p className={styles.empty}>
          Пока нет ни одного документа. Добавьте первый.
        </p>
      )}

      <div className={styles.list}>
        {documents.map((doc, index) => (
          <DocumentRow
            key={doc.id}
            doc={doc}
            index={index}
            total={documents.length}
            allPages={allPages}
            disabled={isPending}
            onDelete={() => handleDelete(doc)}
            onToggleActive={() => handleToggle(doc, "is_active")}
            onToggleFooter={() => handleToggle(doc, "show_in_footer")}
            onToggleModal={() => handleToggle(doc, "show_in_modal")}
            onMoveUp={() => handleMove(index, -1)}
            onMoveDown={() => handleMove(index, 1)}
            onUpdated={() => router.refresh()}
            onError={setError}
          />
        ))}
      </div>

      {showAdd ? (
        <div className={styles.addPanel}>
          <DocFields
            value={newDoc}
            onChange={setNewDoc}
            allPages={allPages}
            slugEditable
          />
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={handleCreate}
              disabled={isPending}
              className={styles.btnPrimary}
            >
              {isPending ? "Сохранение..." : "Сохранить"}
            </button>
            <button
              type="button"
              onClick={closeAddPanel}
              className={styles.btnSecondary}
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openAddPanel}
          className={`${styles.btnPrimary} ${styles.addButton}`}
        >
          + Добавить документ
        </button>
      )}
    </fieldset>
  );
}

function DocumentRow({
  doc,
  index,
  total,
  allPages,
  disabled,
  onDelete,
  onToggleActive,
  onToggleFooter,
  onMoveUp,
  onMoveDown,
  onUpdated,
  onError,
  onToggleModal,
}: {
  doc: LegalDocument;
  index: number;
  total: number;
  allPages: PageOption[];
  disabled: boolean;
  onDelete: () => void;
  onToggleActive: () => void;
  onToggleFooter: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onUpdated: () => void;
  onError: (message: string) => void;
  onToggleModal: () => void;
}) {
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState<DocumentDraft>({
    slug: doc.slug,
    title: doc.title,
    url: doc.url,
    url_type: doc.url_type,
    show_in_footer: doc.show_in_footer,
    show_in_modal: doc.show_in_modal,
  });
  const [busy, startTransition] = useTransition();

  const save = () => {
    startTransition(async () => {
      const res = await updateLegalDocument(doc.id, {
  title: draft.title,
  url: draft.url,
  url_type: draft.url_type,
  show_in_footer: draft.show_in_footer,
  show_in_modal: draft.show_in_modal,
});
      if (res.error) {
        onError(res.error);
      } else {
        setEditMode(false);
        onUpdated();
      }
    });
  };

  const cancelEdit = () => {
    setEditMode(false);
    setDraft({
      slug: doc.slug,
      title: doc.title,
      url: doc.url,
      url_type: doc.url_type,
      show_in_footer: doc.show_in_footer,
      show_in_modal: doc.show_in_modal
    });
  };

  const rowClass = `${styles.row} ${!doc.is_active ? styles.rowInactive : ""}`;

  return (
    <div className={rowClass}>
      {editMode ? (
        <>
          <DocFields
            value={draft}
            onChange={setDraft}
            allPages={allPages}
            slugEditable={false}
          />
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className={styles.btnPrimary}
            >
              {busy ? "..." : "Сохранить"}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              disabled={busy}
              className={styles.btnSecondary}
            >
              Отмена
            </button>
          </div>
        </>
      ) : (
        <div className={styles.rowMain}>
          <div className={styles.orderButtons}>
            <button
              type="button"
              onClick={onMoveUp}
              disabled={index === 0 || disabled}
              className={styles.arrowBtn}
              aria-label="Переместить выше"
              title="Выше"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={index === total - 1 || disabled}
              className={styles.arrowBtn}
              aria-label="Переместить ниже"
              title="Ниже"
            >
              ▼
            </button>
          </div>

          <div className={styles.info}>
            <div className={styles.title}>{doc.title}</div>
            <div className={styles.meta}>
              slug: <code>{doc.slug}</code> · URL: <code>{doc.url}</code> ·{" "}
              {doc.url_type === "PAGE" ? "внутренняя" : "внешняя"}
            </div>
          </div>

          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={doc.is_active}
              onChange={onToggleActive}
              disabled={disabled}
            />
            активен
          </label>

          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={doc.show_in_footer}
              onChange={onToggleFooter}
              disabled={disabled}
            />
            в футере
          </label>

          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={doc.show_in_modal}
              onChange={onToggleModal}
              disabled={disabled}
            />
            в модальном окне
          </label>

          <button
            type="button"
            onClick={() => setEditMode(true)}
            className={styles.btnSecondary}
            disabled={disabled}
          >
            Изменить
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={disabled}
            className={styles.btnDanger}
          >
            Удалить
          </button>
        </div>
      )}
    </div>
  );
}

function DocFields({
  value,
  onChange,
  allPages,
  slugEditable,
}: {
  value: DocumentDraft;
  onChange: (v: DocumentDraft) => void;
  allPages: PageOption[];
  slugEditable: boolean;
}) {
  const isExternal = value.url_type === "EXTERNAL";

  return (
    <div className={styles.fields}>
      <div className={styles.fieldsRow}>
        <label className={styles.label}>
          <span className={styles.labelText}>Slug</span>
          <input
            type="text"
            value={value.slug}
            onChange={(e) => onChange({ ...value, slug: e.target.value })}
            disabled={!slugEditable}
            placeholder="privacy_policy"
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          <span className={styles.labelText}>Название</span>
          <input
            type="text"
            value={value.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
            placeholder="Политика конфиденциальности"
            className={styles.input}
          />
        </label>
      </div>

      <div className={styles.fieldsRow}>
        <label className={styles.label}>
          <span className={styles.labelText}>Тип ссылки</span>
          <select
            value={value.url_type}
            onChange={(e) =>
              onChange({ ...value, url_type: e.target.value as LegalUrlType })
            }
            className={styles.input}
          >
            <option value="PAGE">Внутренняя страница сайта</option>
            <option value="EXTERNAL">Внешний URL</option>
          </select>
        </label>

        {isExternal ? (
          <label className={styles.label}>
            <span className={styles.labelText}>URL</span>
            <input
              type="text"
              value={value.url}
              onChange={(e) => onChange({ ...value, url: e.target.value })}
              placeholder="https://example.com/privacy"
              className={styles.input}
            />
          </label>
        ) : (
          <label className={styles.label}>
            <span className={styles.labelText}>Страница сайта</span>
            <select
              value={value.url}
              onChange={(e) => onChange({ ...value, url: e.target.value })}
              className={styles.input}
            >
              <option value="">— выберите страницу —</option>
              {allPages.map((p) => (
                <option
                  key={p.slug}
                  value={p.slug === "/" ? "/" : `/${p.slug}`}
                >
                  {p.name} [{p.slug === "/" ? "/" : `/${p.slug}`}]
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={value.show_in_footer}
          onChange={(e) =>
            onChange({ ...value, show_in_footer: e.target.checked })
          }
        />
        Показывать ссылку в подвале сайта
      </label>

      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={value.show_in_modal}
          onChange={(e) =>
            onChange({ ...value, show_in_modal: e.target.checked })
          }
        />
        Показывать в модальном окне "Оставить заявку"
      </label>
    </div>
  );
}