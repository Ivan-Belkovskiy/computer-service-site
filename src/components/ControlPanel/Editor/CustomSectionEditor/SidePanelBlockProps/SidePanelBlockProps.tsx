'use client';

import "./SidePanelBlockProps.css";

export default function SidePanelBlockProps({
  blockData,
  updateBlocksData,
  onDeleteBlock,
}: {
  blockData?: any;
  updateBlocksData?: (data: (prev: any[]) => any[]) => void;
  onDeleteBlock?: (id: string) => void;
}) {
  const updateBlockProp = (prop: string, value: any, defaultValue: any) => {
    updateBlocksData?.((p) => [
      ...p.map((block) => {
        if (block.id === blockData.id) {
          return {
            ...block,
            props: {
              ...block.props,
              [prop]: value || defaultValue,
            },
          };
        } else {
          return block;
        }
      }),
    ]);
  };

  const renderSettings = () => {
    switch (blockData?.type) {
      case "heading":
        return (
          <>
            <div className="sidepanel-block-prop">
              <span className="sidepanel-block-prop__label">Тип заголовка:</span>
              <select
                className="sidepanel-block-prop__select"
                value={blockData.props.level}
                onChange={(e) => updateBlockProp('level', e.target.value, 'h2')}
              >
                <option value="h1">h1</option>
                <option value="h2">h2</option>
                <option value="h3">h3</option>
                <option value="h4">h4</option>
                <option value="h5">h5</option>
                <option value="h6">h6</option>
              </select>
            </div>

            <div className="sidepanel-block-prop">
              <span className="sidepanel-block-prop__label">Выравнивание по:</span>
              <select
                className="sidepanel-block-prop__select"
                value={blockData.props.align}
                onChange={(e) => updateBlockProp('align', e.target.value, 'left')}
              >
                <option value="left">левому краю</option>
                <option value="center">центру</option>
                <option value="right">правому краю</option>
              </select>
            </div>

            <div className="sidepanel-block-prop">
              <span className="sidepanel-block-prop__label">Цвет текста:</span>
              <input
                className="sidepanel-block-prop__input"
                type="color"
                value={blockData.props.color || "#720281"}
                onChange={(e) => updateBlockProp('color', e.target.value, '#720281')}
              />
            </div>
            <div className="sidepanel-block-prop">
              <span className="sidepanel-block-prop__label">Цвет фона:</span>
              <input
                className="sidepanel-block-prop__input"
                type="color"
                value={blockData.props.backgroundColor || "#fff"}
                onChange={(e) => updateBlockProp('backgroundColor', e.target.value, '#fff')}
              />
            </div>
            <button
              className="sidepanel-block-props__button"
              onClick={() => {
                const textColor = blockData.props.color || "#720281";
                const bgColor = blockData.props.backgroundColor || "#fff";
                updateBlockProp('color', bgColor, '#720281');
                updateBlockProp('backgroundColor', textColor, '#fff');
              }}
            >
              Инвертировать цвета
            </button>
          </>
        );

      case "text":
        return (
          <>
            <div className="sidepanel-block-prop">
              <span className="sidepanel-block-prop__label">Выравнивание:</span>
              <select
                className="sidepanel-block-prop__select"
                value={blockData.props.align}
                onChange={(e) => updateBlockProp('align', e.target.value, 'left')}
              >
                <option value="left">по левому краю</option>
                <option value="center">по центру</option>
                <option value="right">по правому краю</option>
                <option value="justify">по ширине</option>
              </select>
            </div>

            <div className="sidepanel-block-prop">
              <span className="sidepanel-block-prop__label">Цвет текста:</span>
              <input
                className="sidepanel-block-prop__input"
                type="color"
                value={blockData.props.color || "#720281"}
                onChange={(e) => updateBlockProp('color', e.target.value, '#720281')}
              />
            </div>
            <div className="sidepanel-block-prop">
              <span className="sidepanel-block-prop__label">Цвет фона:</span>
              <input
                className="sidepanel-block-prop__input"
                type="color"
                value={blockData.props.backgroundColor || "#fff"}
                onChange={(e) => updateBlockProp('backgroundColor', e.target.value, '#fff')}
              />
            </div>
            <button
              className="sidepanel-block-props__button"
              onClick={() => {
                const textColor = blockData.props.color || "#720281";
                const bgColor = blockData.props.backgroundColor || "#fff";
                updateBlockProp('color', bgColor, '#720281');
                updateBlockProp('backgroundColor', textColor, '#fff');
              }}
            >
              Инвертировать цвета
            </button>
          </>
        );

      case "image":
        return (
          <>
            <div className="sidepanel-block-prop">
              <span className="sidepanel-block-prop__label">Выравнивание:</span>
              <select
                className="sidepanel-block-prop__select"
                value={blockData.props.align || 'center'}
                onChange={(e) => updateBlockProp('align', e.target.value, 'center')}
              >
                <option value="left">по левому краю</option>
                <option value="center">по центру</option>
                <option value="right">по правому краю</option>
              </select>
            </div>

            <div className="sidepanel-block-prop">
              <span className="sidepanel-block-prop__label">Ширина изображения:</span>
              <select
                className="sidepanel-block-prop__select"
                value={blockData.props.width || '100%'}
                onChange={(e) => updateBlockProp('width', e.target.value, '100%')}
              >
                <option value="25%">25%</option>
                <option value="50%">50%</option>
                <option value="75%">75%</option>
                <option value="100%">100% (Вся ширина)</option>
              </select>
            </div>

            <div className="sidepanel-block-prop">
              <span className="sidepanel-block-prop__label">ALT-описание:</span>
              <input
                className="sidepanel-block-prop__input"
                type="text"
                placeholder="Описание картинки"
                value={blockData.props.alt || ''}
                onChange={(e) => updateBlockProp('alt', e.target.value, '')}
              />
            </div>

            <div className="sidepanel-block-prop">
              <span className="sidepanel-block-prop__label">Скругление углов:</span>
              <select
                className="sidepanel-block-prop__select"
                value={blockData.props.borderRadius || '8px'}
                onChange={(e) => updateBlockProp('borderRadius', e.target.value, '8px')}
              >
                <option value="0px">Без скругления</option>
                <option value="8px">Легкое (8px)</option>
                <option value="16px">Среднее (16px)</option>
                <option value="24px">Сильное (24px)</option>
                <option value="50%">Круглое (50%)</option>
              </select>
            </div>
          </>
        );

      case "separator":
        return (
          <>
            <div className="sidepanel-block-prop">
              <span className="sidepanel-block-prop__label">Ширина:</span>
              <select
                className="sidepanel-block-prop__select"
                value={blockData.props.width || '100%'}
                onChange={(e) => updateBlockProp('width', e.target.value, '100%')}
              >
                <option value="100%">100% (Полная ширина)</option>
                <option value="80%">80%</option>
                <option value="75%">75%</option>
                <option value="50%">50%</option>
                <option value="25%">25%</option>
              </select>
            </div>

            <div className="sidepanel-block-prop">
              <span className="sidepanel-block-prop__label">Высота:</span>
              <input
                type="number"
                className="sidepanel-block-prop__input"
                value={blockData.props.height || 2}
                onChange={(e) => updateBlockProp('height', e.target.value, 2)}
              />
              <span>px</span>
            </div>

            <div className="sidepanel-block-prop">
              <span className="sidepanel-block-prop__label">Скругление углов:</span>
              <input
                type="number"
                className="sidepanel-block-prop__input"
                value={blockData.props.borderRadius || 0}
                onChange={(e) => updateBlockProp('borderRadius', e.target.value, 0)}
              />
              <span>px</span>
            </div>
          </>
        );
    }
  };

  if (blockData)
    return (
      <div className="sidepanel-block-props">
        {renderSettings()}
        <button
          className="sidepanel-block-props__button delete-button"
          onClick={() => onDeleteBlock?.(blockData.id)}
        >
          Удалить блок
        </button>
      </div>
    );
}