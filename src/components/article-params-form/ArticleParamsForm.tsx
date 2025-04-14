import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import styles from './ArticleParamsForm.module.scss';
import {
	ArticleStateType,
	backgroundColors,
	contentWidthArr,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
	OptionType,
} from 'src/constants/articleProps';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { Select } from 'src/ui/select';
import { Text } from 'src/ui/text';

interface ArticleParamsFormProps {
	stateArticle: ArticleStateType;
	setStateArticle: (data: ArticleStateType) => void;
	formChange: () => void;
}

export function ArticleParamsForm({
	stateArticle,
	setStateArticle,
	formChange,
}: ArticleParamsFormProps) {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const [selectedStateArticle, setSelectedStateArticle] =
		useState<ArticleStateType>(stateArticle);
	const containerRef = useRef<HTMLDivElement>(null);

	const handleChangeSelectedState = (
		key: keyof ArticleStateType,
		value: OptionType
	) => {
		setSelectedStateArticle((prev) => ({ ...prev, [key]: value }));
	};

	const handleSubmitState = (event: SyntheticEvent) => {
		event.preventDefault();
		setStateArticle(selectedStateArticle);
	};

	const handleResetState = () => {
		formChange();
		setSelectedStateArticle(stateArticle);
	};

	useEffect(() => {
		setSelectedStateArticle(stateArticle);
	}, [stateArticle]);

	const handleClickOutside = (event: MouseEvent) => {
		if (
			containerRef.current &&
			!containerRef.current.contains(event.target as Node)
		) {
			setIsMenuOpen(false);
		}
	};

	useEffect(() => {
		if (!isMenuOpen) return;
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isMenuOpen]);

	const renderSelect = (
		key: keyof ArticleStateType,
		options: OptionType[],
		title: string,
		placeholder: string
	) => (
		<Select
			selected={selectedStateArticle[key]}
			options={options}
			onChange={(value) => handleChangeSelectedState(key, value)}
			placeholder={placeholder}
			title={title}
		/>
	);

	return (
		<>
			<ArrowButton
				isOpen={isMenuOpen}
				onClick={() => setIsMenuOpen(!isMenuOpen)}
			/>
			<aside
				ref={containerRef}
				className={clsx(styles.container, isMenuOpen && styles.container_open)}>
				<form
					className={styles.form}
					onSubmit={handleSubmitState}
					onReset={handleResetState}>
					<Text size={31} weight={800} uppercase={true}>
						Задайте параметры
					</Text>
					{renderSelect(
						'fontFamilyOption',
						fontFamilyOptions,
						'Шрифт',
						'Выберите шрифт'
					)}
					{renderSelect(
						'fontSizeOption',
						fontSizeOptions,
						'Размер шрифта',
						'Выберите размер шрифта'
					)}
					{renderSelect(
						'fontColor',
						fontColors,
						'Цвет шрифта',
						'Выберите цвет шрифта'
					)}
					{renderSelect(
						'backgroundColor',
						backgroundColors,
						'Цвет фона',
						'Выберите цвет фона'
					)}
					{renderSelect(
						'contentWidth',
						contentWidthArr,
						'Ширина контента',
						'Выберите ширину контента'
					)}
					<div className={styles.bottomContainer}>
						<Button
							title='Сбросить'
							htmlType='button'
							type='clear'
							onClick={handleResetState}
						/>
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
}
