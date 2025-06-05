import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './report.css';
import { assets } from '../../../../assets/assets';

export default function Report() {
    const location = useLocation();
    const { score, testType } = location.state || { score: 0, testType: '' };

    // 根据测试类型获取最大可能分数
    const getMaxScore = () => {
        // 假设每个测试有5个问题，每个问题最高分3分
        return 15;
    };
    
    const maxScore = getMaxScore();
    
    // 计算分数百分比
    const scorePercentage = (score / maxScore) * 100;
    
    // 根据测试类型和得分给出评估结果
    const getAssessmentResult = (testType, score) => {
        if (testType === 'anxiety') {
            if (score <= 5) return 'Your anxiety level is very low and within a healthy range.';
            if (score <= 10) return 'You have mild anxiety, you can try some self-regulation methods.';
            return 'Your anxiety level is high, it is recommended to seek help from professionals.';
        } else if (testType === 'depression') {
            if (score <= 5) return 'You show no signs of depression and are in good emotional state.';
            if (score <= 10) return 'You have mild depressive emotions, it is recommended to pay more attention to your emotional changes.';
            return 'Your depression level is high, it is recommended to consult a psychologist or professional counselor.';
        } else if (testType === 'career') {
            if (score <= 5) return 'You may be more suitable for structured work environments with clear rules.';
            if (score <= 10) return 'You may perform best in work environments that balance creativity and rules.';
            return 'You may be more suitable for creative and highly flexible work environments.';
        }
        return 'Unable to provide assessment, test type not recognized.';
    };
    
    // 获取测试名称
    const getTestName = () => {
        if (testType === 'anxiety') {
            return 'Anxiety Self-Assessment Test';
        } else if (testType === 'depression') {
            return 'Depression Self-Assessment Test';
        } else if (testType === 'career') {
            return 'Career Orientation Test';
        }
        return 'Psychological Test';
    };

    return (
        <div className="report-page">
            <img src={assets.Test_answer_bg} alt="Background" className="bg-image" />
            <div className="report-container">
                <h1 className="report-title">{getTestName()} - Result Report</h1>
                
                <div className="score-display">
                    <div className="score-circle">
                        <span className="score-number">{score}</span>
                        <span className="score-total">/{maxScore}</span>
                    </div>
                    <div className="score-bar-container">
                        <div className="score-bar" style={{ width: `${scorePercentage}%` }}></div>
                    </div>
                </div>
                
                <div className="assessment-section">
                    <h2>Assessment Results</h2>
                    <p className="assessment-text">{getAssessmentResult(testType, score)}</p>
                </div>
                
                <div className="recommendations-section">
                    <h2>Recommendations</h2>
                    <ul className="recommendations-list">
                        <li>Maintain regular sleep and eating habits</li>
                        <li>Engage in appropriate physical exercise daily</li>
                        <li>Stay connected with family and friends</li>
                        <li>Learn relaxation techniques such as deep breathing and meditation</li>
                        <li>Seek help from professionals if needed</li>
                    </ul>
                </div>
                
                <div className="navigation-buttons">
                    <Link to="/self-psycho" className="back-to-tests">Back to Test List</Link>
                    <Link to="/" className="go-home">Back to Home</Link>
                </div>
            </div>
        </div>
    );
}
