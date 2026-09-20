import {
  backgroundColors,
  contentWidthArr,
  defaultArticleState,
  fontColors,
  fontFamilyOptions,
  fontSizeOptions,
} from '@/constants/articleProps';
import { ArrowButton } from '@/ui/arrow-button';
import { Button } from '@/ui/button';
import { RadioGroup } from '@/ui/radio-group';
import { Select } from '@/ui/select';
import { Separator } from '@/ui/separator';
import { Text } from '@/ui/text';
import { clsx } from 'clsx';
import { useState, useRef, useEffect } from 'react';

import type { ArticleStateType, OptionType } from '@/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

const FORM_TITLE = 'Задайте параметры';
const FONT_SIZE_RADIO_NAME = 'fontSize';
const FONT_NAME_TITLE = 'Шрифт';
const FONT_SIZE_TITLE = 'Размер шрифта';
const FONT_COLOR_TITLE = 'Цвет шрифта';
const BACKGROUND_COLOR_TITLE = 'Цвет фона';
const CONTENT_WIDTH_TITLE = 'Ширина контента';
const BUTTON_RESET_NAME = 'Сбросить';
const BUTTON_SUBMIT_NAME = 'Применить';

type ArticleParamsFormProps = {
  articleState: ArticleStateType;
  onApply: (newState: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
  articleState,
  onApply,
}: ArticleParamsFormProps): React.JSX.Element => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [draftState, setDraftState] = useState<ArticleStateType>(articleState);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent): void => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = (): void => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleChange =
    (field: keyof ArticleStateType) =>
    (option: OptionType): void => {
      setDraftState((prevDraft) => ({ ...prevDraft, [field]: option }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onApply(draftState);
  };

  const handleReset = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setDraftState(defaultArticleState);
    onApply(defaultArticleState);
  };

  return (
    <div ref={rootRef}>
      <ArrowButton isOpen={isOpen} onClick={handleToggle} />
      <aside className={clsx(styles.container, isOpen && styles.container_open)}>
        <form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
          <Text as="h2" size={31} weight={800} uppercase>
            {FORM_TITLE}
          </Text>
          <Select
            title={FONT_NAME_TITLE}
            options={fontFamilyOptions}
            selected={draftState.fontFamilyOption}
            onChange={handleChange('fontFamilyOption')}
          />
          <RadioGroup
            name={FONT_SIZE_RADIO_NAME}
            title={FONT_SIZE_TITLE}
            options={fontSizeOptions}
            selected={draftState.fontSizeOption}
            onChange={handleChange('fontSizeOption')}
          />
          <Select
            title={FONT_COLOR_TITLE}
            options={fontColors}
            selected={draftState.fontColor}
            onChange={handleChange('fontColor')}
          />
          <Separator />
          <Select
            title={BACKGROUND_COLOR_TITLE}
            options={backgroundColors}
            selected={draftState.backgroundColor}
            onChange={handleChange('backgroundColor')}
          />
          <Select
            title={CONTENT_WIDTH_TITLE}
            options={contentWidthArr}
            selected={draftState.contentWidth}
            onChange={handleChange('contentWidth')}
          />
          <div className={styles.bottomContainer}>
            <Button title={BUTTON_RESET_NAME} htmlType="reset" type="clear" />
            <Button title={BUTTON_SUBMIT_NAME} htmlType="submit" type="apply" />
          </div>
        </form>
      </aside>
    </div>
  );
};
