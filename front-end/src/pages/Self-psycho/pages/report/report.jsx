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
    const getAssessment = () => {
        if (testType === 'anxiety') {
            if (score <= 5) return '您的焦虑水平很低，处于健康范围内。';
            if (score <= 10) return '您有轻度焦虑，可以尝试一些自我调节方法。';
            return '您的焦虑水平较高，建议寻求专业人士的帮助。';
        } else if (testType === 'depression') {
            if (score <= 5) return '您没有表现出抑郁症状，情绪状态良好。';
            if (score <= 10) return '您有轻度抑郁情绪，建议多关注自己的情绪变化。';
            return '您的抑郁程度较高，建议咨询心理医生或专业心理咨询师。';
        } else if (testType === 'career') {
            if (score <= 5) return '您可能更适合结构化、规则明确的工作环境。';
            if (score <= 10) return '您可能在平衡创意与规则的工作环境中表现最佳。';
            return '您可能更适合创意性、灵活性高的工作环境。';
        }
        return '无法提供评估，测试类型未识别。';
    };
    
    // 获取测试名称
    const getTestName = () => {
        switch (testType) {
            case 'anxiety':
                return '焦虑自评测试';
            case 'depression':
                return '抑郁自评测试';
            case 'career':
                return '职业倾向测试';
            default:
                return '心理测试';
        }
    };

    return (
        <div className="report-page">
            <img src={assets.Test_answer_bg} alt="Background" className="bg-image" />
            <div className="report-container">
                <h1 className="report-title">{getTestName()} - 结果报告</h1>
                
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
                    <h2>评估结果</h2>
                    <p className="assessment-text">{getAssessment()}</p>
                </div>
                
                <div className="recommendations-section">
                    <h2>建议</h2>
                    <ul className="recommendations-list">
                        <li>保持规律的睡眠和饮食习惯</li>
                        <li>每天进行适当的体育锻炼</li>
                        <li>与家人和朋友保持联系</li>
                        <li>学习放松技巧，如深呼吸和冥想</li>
                        <li>如有需要，寻求专业人士的帮助</li>
                    </ul>
                </div>
                
                <div className="navigation-buttons">
                    <Link to="/self-psycho" className="back-to-tests">返回测试列表</Link>
                    <Link to="/" className="go-home">返回主页</Link>
                </div>
            </div>
        </div>
    );
}
